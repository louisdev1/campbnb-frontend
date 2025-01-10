<template>
  <div class="future-bookings">
    <h1>Upcoming Bookings</h1>

    <div v-if="futureBookings.length">
      <div v-for="booking in futureBookings" :key="booking.BookingID" class="booking-card">
        <h2>{{ booking.Name }}</h2>
        <p>📍 {{ booking.Address }}, {{ booking.City }}, {{ booking.Country }}</p>
        <p>📅 From: {{ formatDate(booking.StartDate) }} → To: {{ formatDate(booking.EndDate) }}</p>
        <p>💸 Total Price: €{{ booking.TotalPrice }}</p>

        <!-- ✅ Buttons for Edit and Remove -->
        <button @click="openEditModal(booking)" class="edit-btn">Edit Booking</button>
        <button @click="removeBooking(booking.BookingID)" class="remove-btn">Remove Booking</button>
      </div>
    </div>

    <div v-else>
      <p>No upcoming bookings.</p>
    </div>

    <!-- ✅ Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Edit Booking Dates</h2>
        <label>Start Date:</label>
        <input type="date" v-model="editedStartDate" />

        <label>End Date:</label>
        <input type="date" v-model="editedEndDate" />

        <button @click="submitEdit">Save Changes</button>
        <button @click="closeEditModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      futureBookings: [],
      showEditModal: false,
      selectedBookingId: null,
      editedStartDate: '',
      editedEndDate: '',
    };
  },
  async created() {
    await this.fetchFutureBookings();
  },
  methods: {
    // ✅ Fetch all future bookings
    async fetchFutureBookings() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/api/bookings/future', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.futureBookings = response.data;
      } catch (error) {
        console.error('Failed to fetch future bookings:', error);
      }
    },

    // ✅ Remove a booking
    async removeBooking(bookingId) {
      if (confirm('Are you sure you want to remove this booking?')) {
        const token = localStorage.getItem('token');
        try {
          await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Booking removed successfully!');
          await this.fetchFutureBookings();
        } catch (error) {
          console.error('Failed to remove booking:', error);
          alert('Failed to remove booking.');
        }
      }
    },

    // ✅ Open the Edit Modal
    openEditModal(booking) {
      this.selectedBookingId = booking.BookingID;
      this.editedStartDate = booking.StartDate.split('T')[0];
      this.editedEndDate = booking.EndDate.split('T')[0];
      this.showEditModal = true;
    },

    // ✅ Close the Edit Modal
    closeEditModal() {
      this.showEditModal = false;
      this.selectedBookingId = null;
      this.editedStartDate = '';
      this.editedEndDate = '';
    },

    // ✅ Submit Edited Dates
    async submitEdit() {
      const token = localStorage.getItem('token');
      if (!this.editedStartDate || !this.editedEndDate) {
        alert('Please select both start and end dates.');
        return;
      }

      try {
        await axios.put(`http://localhost:3000/api/bookings/${this.selectedBookingId}`, {
          startDate: this.editedStartDate,
          endDate: this.editedEndDate
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('Booking updated successfully!');
        this.closeEditModal();
        await this.fetchFutureBookings();
      } catch (error) {
        console.error('Failed to update booking:', error);
        alert('Failed to update booking.');
      }
    },

    // ✅ Format Date
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

.edit-btn, .remove-btn {
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-btn {
  background-color: #ffa500;
  color: white;
}

.remove-btn {
  background-color: #f44336;
  color: white;
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
