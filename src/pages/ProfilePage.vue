<template>
  <div class="dashboard-container">
    <h1>Welcome to Your Dashboard</h1>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="$router.push('/settings')" class="settings-btn">Settings</button>
      <button @click="$router.push('/addspot')" class="add-spot-btn">Add Camping Spot</button>
    </div>

    <h2>My Camping Spots</h2>
    <div v-if="spots.length">
      <div v-for="spot in spots" :key="spot.id" class="spot-card">
        <h3>{{ spot.name }}</h3>
        <p>{{ spot.address }}, {{ spot.city }}, {{ spot.country }}</p>
        <p><strong>Features:</strong> {{ spot.features }}</p>
        <p><strong>Price:</strong> €{{ spot.pricePerNight }} / night</p>
      </div>
    </div>
    <div v-else>
      <p>You have no camping spots yet. <router-link to="/addspot">Add One</router-link></p>
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
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        this.$router.push('/login');
        return;
      }

      const response = await axios.get(`http://localhost:3000/api/my-spots/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.spots = response.data;
    } catch (error) {
      console.error('Failed to fetch spots:', error);
    }
  },
};
</script>

<style scoped>
.dashboard-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

.spot-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 20px 0;
  border-radius: 10px;
  text-align: left;
  background-color: white;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.settings-btn,
.add-spot-btn {
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.settings-btn:hover,
.add-spot-btn:hover {
  background-color: #45a049;
}
</style>
