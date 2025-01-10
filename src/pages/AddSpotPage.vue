<template>
  <div class="dashboard-container">

    <!-- Actieknoppen alleen zichtbaar als gebruiker is ingelogd -->
    <div v-if="isLoggedIn" class="action-buttons">
      <button @click="$router.push('/settings')" class="settings-btn">Settings</button>
      <button @click="$router.push('/addspot')" class="add-spot-btn">Add Camping Spot</button>
      <button @click="$router.push('/bookings')" class="bookings-btn">Leave a review</button>
      <button @click="$router.push('/future-bookings')" class="future-bookings-btn">Future Bookings</button>
    </div>

    <div v-else>
      <p>Please <router-link to="/login">log in</router-link> to manage your camping spots.</p>
    </div>

    <h2>My Camping Spots</h2>
    <div v-if="spots.length">
      <div v-for="spot in spots" :key="spot.LocationID" class="spot-card">
        <h3>{{ spot.Name }}</h3>
        <p>{{ spot.Address }}, {{ spot.City }}, {{ spot.Country }}</p>
        <p><strong>Features:</strong> {{ spot.Features }}</p>
        <p><strong>Price:</strong> €{{ spot.PricePerNight }} / night</p>

        <!-- Edit en Delete knoppen -->
        <button @click="openEditModal(spot)" class="edit-btn">Edit Spot</button>
        <button @click="deleteSpot(spot.LocationID)" class="delete-btn">Delete Spot</button>
      </div>
    </div>
    <div v-else>
      <p>You have no camping spots yet. <router-link to="/addspot">Add One</router-link></p>
    </div>

    <!-- 📝 Edit Spot Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Edit Camping Spot</h2>

        <label>Name:</label>
        <input v-model="selectedSpot.Name" type="text" />

        <label>Address:</label>
        <input v-model="selectedSpot.Address" type="text" />

        <label>City:</label>
        <input v-model="selectedSpot.City" type="text" />

        <label>Country:</label>
        <input v-model="selectedSpot.Country" type="text" />

        <label>Features:</label>
        <input v-model="selectedSpot.Features" type="text" />

        <label>Price per Night (€):</label>
        <input v-model.number="selectedSpot.PricePerNight" type="number" />

        <button @click="updateSpot">Save Changes</button>
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
      isLoggedIn: false,
      spots: [],
      showEditModal: false,      // ✅ Modal visibility state
      selectedSpot: null,        // ✅ Holds the selected spot for editing
    };
  },
  async created() {
    this.checkLoginStatus();
    await this.fetchSpots();
  },
  methods: {
    // ✅ Controleer of de gebruiker is ingelogd
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },

    // ✅ Haal de camping spots op
    async fetchSpots() {
      try {
        const userId = JSON.parse(localStorage.getItem('user'))?.id;
        const token = localStorage.getItem('token');

        if (!userId || !token) {
          this.isLoggedIn = false;
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/spots/owner/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.spots = response.data;
      } catch (error) {
        console.error('Failed to fetch spots:', error);
      }
    },

    // ✅ Open the Edit Modal
    openEditModal(spot) {
      this.selectedSpot = { ...spot };  // Clone the selected spot to avoid direct changes
      this.showEditModal = true;        // Show the modal
    },

    // ✅ Close the Edit Modal
    closeEditModal() {
      this.showEditModal = false;
      this.selectedSpot = null;
    },

    // ✅ Update the Spot
    async updateSpot() {
      const token = localStorage.getItem('token');
      try {
        await axios.put(`http://localhost:3000/api/spots/${this.selectedSpot.LocationID}`, this.selectedSpot, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert('Spot updated successfully!');
        this.closeEditModal();
        await this.fetchSpots();  // Refresh the list after updating
      } catch (error) {
        console.error('Failed to update spot:', error);
        alert('Failed to update spot.');
      }
    },

    // ✅ Verwijder een spot
    async deleteSpot(spotId) {
      const token = localStorage.getItem('token');
      if (confirm('Weet je zeker dat je deze spot wilt verwijderen?')) {
        try {
          await axios.delete(`http://localhost:3000/api/spots/${spotId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert('Spot succesvol verwijderd!');
          await this.fetchSpots();
        } catch (error) {
          console.error('Verwijderen mislukt:', error);
          alert('Verwijderen mislukt.');
        }
      }
    }
  }
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.settings-btn,
.add-spot-btn,
.bookings-btn,
.future-bookings-btn {
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.edit-btn,
.delete-btn {
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

.delete-btn {
  background-color: #f44336;
  color: white;
}

.settings-btn:hover,
.add-spot-btn:hover,
.bookings-btn:hover {
  background-color: #45a049;
}

/* 📝 Edit Modal Styles */
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.modal-content input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-content button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #45a049;
}
</style>
