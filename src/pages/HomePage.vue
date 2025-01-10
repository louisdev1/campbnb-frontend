<template>
  <div class="home-page">
    <h1>Welcome to CampBnB</h1>

    <!-- Menu for Login or Settings -->
    <div class="menu">
      <button v-if="!isLoggedIn" @click="openLoginModal">Login</button>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <input v-model="filterGuests" type="number" placeholder="Max Guests" />

      <div class="feature-filter">
        <label v-for="feature in features" :key="feature">
          <input type="checkbox" :value="feature" v-model="selectedFeatures" />
          {{ feature }}
        </label>
      </div>

      <!-- ✅ Price Filter Buttons -->
      <div class="price-filter">
        <button @click="setPriceRange('under50')" :class="{ active: selectedPriceRange === 'under50' }">
          Under €50
        </button>
        <button @click="setPriceRange('50to100')" :class="{ active: selectedPriceRange === '50to100' }">
          €50 - €100
        </button>
        <button @click="setPriceRange('100to200')" :class="{ active: selectedPriceRange === '100to200' }">
          €100 - €200
        </button>
        <button @click="setPriceRange('200plus')" :class="{ active: selectedPriceRange === '200plus' }">
          €200+
        </button>
      </div>

      <button @click="applyFilter">Filter</button>
    </div>

    <!-- Bookable Spots Section -->
    <div class="spots-list">
      <div v-for="spot in filteredSpots" :key="spot.LocationID" class="spot-card">
        <h2>{{ spot.Name }}</h2>
        <p>{{ spot.Address }}, {{ spot.City }}, {{ spot.Country }}</p>
        <p>€{{ spot.PricePerNight }} per night</p>
        <p>{{ spot.Features }}</p>
        <p v-if="spot.AverageRating > 0">
          {{ parseFloat(spot.AverageRating).toFixed(1) }} / 5
        </p>
        <p v-else>No ratings yet</p>
        <button @click="goToPaymentPage(spot)">Book Now</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      spots: [],
      filterGuests: null,
      selectedFeatures: [],
      selectedPriceRange: null,  // ✅ Added price range filter
      features: ['Wi-Fi', 'Pool', 'BBQ Area', 'Electricity', 'Pet-Friendly', 'Parking', 'Shower'],
      isLoggedIn: !!localStorage.getItem('token'),
    };
  },
  async created() {
    await this.fetchSpotsWithRatings();
  },
  computed: {
    filteredSpots() {
      return this.spots.filter((spot) => {
        const matchGuests = !this.filterGuests || spot.MaxGuests >= this.filterGuests;
        const matchFeatures = this.selectedFeatures.every(feature => spot.Features.includes(feature));
        const matchPrice = this.priceFilter(spot.PricePerNight);

        return matchGuests && matchFeatures && matchPrice;
      });
    },
  },
  methods: {
    async fetchSpotsWithRatings() {
      try {
        const response = await axios.get('http://localhost:3000/api/spots/all-with-ratings');
        this.spots = response.data;
      } catch (error) {
        console.error('Error fetching spots with ratings:', error);
      }
    },
    applyFilter() {
      console.log('Filter applied:', this.filterGuests, this.selectedFeatures, this.selectedPriceRange);
    },
    goToPaymentPage(spot) {
      this.$router.push({ path: '/payment', query: { spotId: spot.LocationID } });
    },
    setPriceRange(range) {
      this.selectedPriceRange = range;
    },
    priceFilter(price) {
      switch (this.selectedPriceRange) {
        case 'under50':
          return price < 50;
        case '50to100':
          return price >= 50 && price <= 100;
        case '100to200':
          return price > 100 && price <= 200;
        case '200plus':
          return price > 200;
        default:
          return true;  // No filter selected
      }
    },
    openLoginModal() {
      this.$emit('openModal');
    }
  }
};
</script>

<style scoped>
.spots-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.spot-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.menu {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin: 10px;
}

button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    margin-top: 10px;
    cursor: pointer;
    border-radius: 5px; /* Matches the price filter buttons */
    border: 1px solid #ccc; /* Subtle border like the price buttons */
    transition: background-color 0.3s ease; /* Smooth hover effect */
}

button:hover {
    background-color: #45a049; /* Darker green on hover */
}

.filter-bar {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.feature-filter {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.price-filter {
  display: flex;
  gap: 10px;
}

.price-filter button {
  padding: 8px 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #45a049;
  cursor: pointer;
}

.price-filter button.active {
  background-color: green;
  color: white;
}
</style>
