<template>
  <div class="add-spot-container">
    <h1>Add a New Camping Spot</h1>
    <form @submit.prevent="submitSpot">
      <input v-model="spot.name" type="text" placeholder="Name" required />
      <input v-model="spot.address" type="text" placeholder="Address" required />
      <input v-model="spot.city" type="text" placeholder="City" required />
      <input v-model="spot.country" type="text" placeholder="Country" required />

      <label for="features">Features (Select Multiple)</label>
      <div class="features-checkboxes">
        <label v-for="feature in featureOptions" :key="feature">
          <input type="checkbox" :value="feature" v-model="spot.features" />
          {{ feature }}
        </label>
      </div>

      <input v-model.number="spot.pricePerNight" type="number" step="0.01" placeholder="Price Per Night (€)" required />
      <input v-model.number="spot.maxGuests" type="number" placeholder="Max Guests" required />

      <button type="submit">Add Spot</button>
    </form>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      spot: {
        name: '',
        address: '',
        city: '',
        country: '',
        features: [],  // Now an array for multiple selections
        pricePerNight: '',
        maxGuests: '',
      },
      featureOptions: ['Wi-Fi', 'Pool', 'BBQ Area', 'Electricity', 'Pet-Friendly', 'Parking', 'Shower'],
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    async submitSpot() {
      const token = localStorage.getItem('token');
      try {
        await axios.post('http://localhost:3000/api/spots/add', this.spot, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.successMessage = 'Camping spot added successfully!';
        this.errorMessage = '';
        this.resetForm();
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Failed to add camping spot.';
        this.successMessage = '';
      }
    },
    resetForm() {
      this.spot = {
        name: '',
        address: '',
        city: '',
        country: '',
        features: [],
        pricePerNight: '',
        maxGuests: '',
      };
    },
  },
};
</script>

<style scoped>
.add-spot-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

input,
select {
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.features-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.features-checkboxes label {
  display: flex;
  align-items: center;
  gap: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
