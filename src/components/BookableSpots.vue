<template>
  <div class="bookable-spots-container">
    <h1>Available Camping Spots</h1>
    <div v-if="spots.length">
      <div v-for="spot in spots" :key="spot.LocationID" class="spot-card">
        <h3>{{ spot.Name }}</h3>
        <p>{{ spot.Address }}, {{ spot.City }} - {{ spot.Country }}</p>
        <p>Features: {{ spot.Features }}</p>
        <p>Price: €{{ spot.PricePerNight }} per night</p>
        <button @click="bookSpot(spot)">Book Now</button>
      </div>
    </div>
    <div v-else>
      <p>No camping spots available.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      spots: [],
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/api/bookable-spots');
      this.spots = response.data;
    } catch (error) {
      console.error('Failed to fetch spots:', error);
    }
  },
  methods: {
    bookSpot(spot) {
      alert(`Booking for ${spot.Name}`);
    },
  },
};
</script>

<style scoped>
.bookable-spots-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}
.spot-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}
</style>
