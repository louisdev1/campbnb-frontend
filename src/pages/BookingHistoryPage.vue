<template>
  <div class="booking-history">
    <h1>My Bookings</h1>

    <div v-if="bookings.length">
      <div v-for="booking in bookings" :key="booking.BookingID" class="booking-card">
        <h2>{{ booking.Name }}</h2>
        <p>📍 {{ booking.Address }}, {{ booking.City }}, {{ booking.Country }}</p>
        <p>📅 From: {{ formatDate(booking.StartDate) }} → To: {{ formatDate(booking.EndDate) }}</p>
        <p>💸 Total Price: €{{ booking.TotalPrice }}</p>

        <!-- ✅ Show review only if not submitted -->
        <div v-if="!booking.hasReviewed" class="review-section">
          <label for="rating">Rating (1-5):</label>
          <input type="number" v-model="booking.rating" min="1" max="5" />

          <label for="comment">Comment:</label>
          <textarea v-model="booking.comment" placeholder="Write your review here..."></textarea>

          <button @click="submitReview(booking)">Submit Review</button>
        </div>

        <div v-else>
          <p>✅ Review submitted. Thank you!</p>
        </div>
      </div>
    </div>

    <div v-else>
      <p>No bookings yet. Start exploring now!</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      bookings: [],
    };
  },
  async created() {
    await this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/api/bookings/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Add hasReviewed flag to each booking
        this.bookings = response.data.map(booking => ({
          ...booking,
          rating: '',
          comment: '',
          hasReviewed: booking.HasReviewed || false,  // Check if a review exists
        }));
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    },

    async submitReview(booking) {
      const token = localStorage.getItem('token');
      if (!booking.rating || !booking.comment) {
        alert('Please provide both a rating and a comment.');
        return;
      }
      try {
        await axios.post('http://localhost:3000/api/reviews', {
          locationId: booking.LocationID,
          rating: booking.rating,
          comment: booking.comment,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Mark booking as reviewed
        booking.hasReviewed = true;
        alert('Review submitted successfully!');
      } catch (error) {
        console.error('Failed to submit review:', error);
        alert('Failed to submit review.');
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.booking-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.review-section {
  margin-top: 15px;
}

textarea {
  width: 100%;
  height: 60px;
  margin-bottom: 10px;
}

button {
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
