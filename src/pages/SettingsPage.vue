<template>
  <div class="settings-container">
    <h1>Update Your Profile</h1>
    <form @submit.prevent="updateProfile">
      <input v-model="user.firstName" placeholder="First Name" required />
      <input v-model="user.surname" placeholder="Surname" required />
      <input v-model="user.email" placeholder="Email" required />
      <input v-model="user.phoneNumber" placeholder="Phone Number" />
      <input v-model="user.address" placeholder="Address" required />
      <input v-model="user.nr" placeholder="House Number" required />
      <input v-model="user.bankDetails" placeholder="Bank Details" />
      <input v-model="user.cardNumber" placeholder="Card Number" />
      <input v-model="user.cardCCV" placeholder="Card CCV" />

      <button type="submit">Update Profile</button>
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
      user: {
        firstName: '',
        surname: '',
        email: '',
        phoneNumber: '',
        address: '',
        nr: '',
        bankDetails: '',
        cardNumber: '',
        cardCCV: ''
      },
      successMessage: '',
      errorMessage: ''
    };
  },
  async mounted() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.user = response.data;
    } catch (error) {
      this.errorMessage = 'Failed to load user data';
    }
  },
  methods: {
    async updateProfile() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.put('http://localhost:3000/api/user/profile', this.user, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.successMessage = 'Profile updated successfully!';
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (error) {
        this.errorMessage = 'Failed to update profile';
      }
    }
  }
};
</script>

<style scoped>
.settings-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

input {
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
}

.error {
  color: red;
}
</style>
