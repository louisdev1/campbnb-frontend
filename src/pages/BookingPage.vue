<template>
  <div class="booking-history">
    <h1>My Bookings</h1>

    <div v-if="bookings.length">
      <div v-for="booking in bookings" :key="booking.BookingID" class="booking-card">
        <h2>{{ booking.Name }}</h2>
        <p>📍 {{ booking.Address }}, {{ booking.City }}, {{ booking.Country }}</p>
        <p>📅 From: {{ formatDate(booking.StartDate) }} → To: {{ formatDate(booking.EndDate) }}</p>
        <p>💸 Total Price: €{{ booking.TotalPrice }}</p>

        <!-- Cancel or Review -->
        <button v-if="!isPastBooking(booking.EndDate)" @click="cancelBooking(booking.BookingID)">Cancel Booking</button>
        <button v-else @click="openRatingModal(booking.LocationID)">Leave a Review</button>
      </div>
    </div>

    <div v-else>
      <p>No bookings yet. Start exploring now!</p>
    </div>

    <!-- Rating Modal -->
    <div v-if="showRatingModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Leave a Review</h2>
        <label for="rating">Rating (1-5):</label>
        <input type="number" v-model="rating" min="1" max="5" />

        <label for="comment">Comment:</label>
        <textarea v-model="comment" placeholder="Write your review here..."></textarea>

        <button @click="submitRating">Submit</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      bookings: [],
      showRatingModal: false,
      selectedLocationId: null,
      rating: '',
      comment: '',
    };
  },
  async created() {
    await this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  console.log('Token:', token);      // ✅ Check if the token exists
  console.log('User:', user);        // ✅ Check user data

  if (!token || !user) {
    console.error('Token or user is missing.');
    return;
  }

  try {
    const response = await axios.get('http://localhost:3000/api/bookings/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Fetched Bookings:', response.data);  // ✅ Verify fetched data

    this.bookings = response.data.map(booking => ({
      ...booking,
      rating: '',
      comment: ''
    }));
  } catch (error) {
    console.error('Failed to fetch bookings:', error);  // ✅ Catch any error
  }
},
    isPastBooking(endDate) {
      return new Date(endDate) < new Date();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    async cancelBooking(bookingId) {
      if (confirm('Are you sure you want to cancel this booking?')) {
        const token = localStorage.getItem('token');
        try {
          await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Booking canceled successfully!');
          await this.fetchBookings();
        } catch (error) {
          console.error('Failed to cancel booking:', error);
        }
      }
    },
    openRatingModal(locationId) {
      this.selectedLocationId = locationId;
      this.showRatingModal = true;
    },
    closeModal() {
      this.showRatingModal = false;
      this.rating = '';
      this.comment = '';
    },
    async submitRating() {
      const token = localStorage.getItem('token');
      try {
        await axios.post('http://localhost:3000/api/reviews', {
          locationId: this.selectedLocationId,
          rating: this.rating,
          comment: this.comment
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('Thank you for your review!');
        this.closeModal();
      } catch (error) {
        console.error('Failed to submit review:', error);
      }
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
</style>
