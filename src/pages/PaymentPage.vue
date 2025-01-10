<template>
  <div class="payment-container">
    <h1>Payment for {{ spot.Name }}</h1>

    <div class="spot-details">
      <p><strong>Location:</strong> {{ spot.Address }}, {{ spot.City }}, {{ spot.Country }}</p>
      <p><strong>Features:</strong> {{ spot.Features }}</p>
      <p><strong>Price per night:</strong> €{{ spot.PricePerNight }}</p>

      <div>
        <label for="check-in">Check-in:</label>
        <input type="date" v-model="checkInDate" id="check-in" />

        <label for="check-out">Check-out:</label>
        <input type="date" v-model="checkOutDate" id="check-out" />

        <p v-if="totalPrice > 0"><strong>Total Price:</strong> €{{ totalPrice }}</p>

        <button @click="bookSpot" :disabled="isUnavailable">Proceed to Pay</button>
        <p v-if="isUnavailable" style="color: red;">Selected dates are unavailable!</p>
      </div>

      <!-- QR Code appears after booking -->
      <div v-if="showQRCode" class="qr-code">
        <h3>Scan to Complete Payment</h3>
        <img src="@/assets/images/QRCodePayPal.jpg" alt="QR Code for Payment" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      spot: {},
      checkInDate: null,
      checkOutDate: null,
      totalPrice: 0,
      unavailableDates: [],
      showQRCode: false,  // ✅ Added state to show QR code
    };
  },
  async created() {
    const spotId = this.$route.query.spotId;
    await this.fetchSpotDetails(spotId);
    await this.fetchUnavailableDates(spotId);
  },
  computed: {
    isUnavailable() {
      return this.unavailableDates.some((dateRange) => {
        const checkIn = new Date(this.checkInDate);
        const checkOut = new Date(this.checkOutDate);
        return (
          (checkIn >= new Date(dateRange.StartDate) && checkIn <= new Date(dateRange.EndDate)) ||
          (checkOut >= new Date(dateRange.StartDate) && checkOut <= new Date(dateRange.EndDate))
        );
      });
    },
  },
  methods: {
    async fetchSpotDetails(spotId) {
  try {
    const response = await axios.get(`http://localhost:3000/api/spots/${spotId}`);
    
    if (response.data && response.data.length > 0) {
      this.spot = response.data[0];  // ✅ Ensure correct data assignment
    } else {
      console.error('No spot data received.');
    }
  } catch (error) {
    console.error('Error fetching spot details:', error);
  }
}
,
    async fetchUnavailableDates(spotId) {
  try {
    const response = await axios.get(`http://localhost:3000/api/bookings/booked-dates/${spotId}`);
    this.unavailableDates = response.data;  // ✅ Correctly using 'response'
  } catch (error) {
    console.error('Error fetching unavailable dates:', error);
  }
},
    calculateTotalPrice() {
      if (this.checkInDate && this.checkOutDate) {
        const checkIn = new Date(this.checkInDate);
        const checkOut = new Date(this.checkOutDate);
        const days = (checkOut - checkIn) / (1000 * 3600 * 24);

        this.totalPrice = days > 0 ? days * this.spot.PricePerNight : 0;
      }
    },
    bookSpot() {
      if (this.isUnavailable || this.totalPrice === 0) {
        alert('Invalid dates or price!');
        return;
      }

      this.showQRCode = true;  // ✅ Show QR code after booking

      // Optional: Notify user
      alert(`Booking successful for ${this.spot.Name} at €${this.totalPrice}`);
    },
  },
  watch: {
    checkInDate() {
      this.calculateTotalPrice();
    },
    checkOutDate() {
      this.calculateTotalPrice();
    },
  },
};
</script>

<style scoped>
.payment-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.spot-details {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: grey;
  cursor: not-allowed;
}

/* ✅ Style for QR Code */
.qr-code {
  margin-top: 20px;
  text-align: center;
}

.qr-code img {
  width: 250px;
  height: 250px;
  object-fit: contain;
  border: 2px solid #ccc;
  padding: 10px;
  background-color: white;
}
</style>
