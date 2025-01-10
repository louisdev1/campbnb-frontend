<template>
  <div class="app-container">
    <div class="sidebar">
      <PageButtons @openModal="showModal = true" />
    </div>

    <div class="main-content">
      <img src="@/assets/campbnb-logo.png" alt="CampBnB Logo" class="logo" />
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal">
      <div class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <button class="cancel-button" @click="showModal = false">
            ×
          </button>
          <div class="modal-logo">
            <img src="@/assets/campbnb-logo.png" alt="CampBnB Logo" />
          </div>
          <div class="modal-inner-content">
            <div class="toggle-buttons">
              <button :class="{ active: isLogin }" @click="toggleMode('login')">
                Login
              </button>

              <button :class="{ active: !isLogin }" @click="toggleMode('register')">
                Register
              </button>
            </div>
            <form v-if="isLogin" @submit.prevent="submitLogin">
              <label>Email</label>
              <input v-model="email" type="email" required />
              <br>
              <label>Password</label>
              <input v-model="password" type="password" required />
              <button type="submit">Login</button>
            </form>
            <form v-else @submit.prevent="submitRegister">
              <div class="input-row">
                <input v-model="firstName" type="text" placeholder="First Name" required />
                <input v-model="surname" type="text" placeholder="Surname" required />
              </div>
              <input v-model="email" type="email" placeholder="Email" required />
              <input v-model="phoneNumber" type="text" placeholder="Phone (Optional)" />
              <div class="input-row">
                <input v-model="address" type="text" placeholder="Address" required />
                <input v-model="nr" type="text" placeholder="Nr" required />
              </div>
              <div class="input-row">
                <input v-model="password" type="password" placeholder="Password" required />
                <input v-model="repeatPassword" type="password" placeholder="Repeat Password" required />
              </div>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageButtons from "@/components/PageButtons.vue";
import axios from "axios";
import './assets/css/main.css';

export default {
  name: "App",
  components: { PageButtons },
  data() {
    return {
      showModal: false,
      isLogin: true,
      firstName: "",
      surname: "",
      email: "",
      password: "",
      repeatPassword: "",
      phoneNumber: "",
      address: "",
      nr: "",
    };
  },
  methods: {
    toggleMode(mode) {
      this.isLogin = mode === "login";
    },
    async submitRegister() {
      if (this.password !== this.repeatPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        const response = await axios.post("http://localhost:3000/api/auth/register", {
          firstName: this.firstName,
          surname: this.surname,
          email: this.email,
          phoneNumber: this.phoneNumber,
          address: this.address,
          nr: this.nr,
          password: this.password,
        });

        alert("Registration successful");
        this.$router.push('/addspotpage');
      } catch (error) {
        alert("This Email is already in use");
      }
    },
    async submitLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password,
        });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          this.$router.push('/addspotpage');
        }
      } catch (error) {
        alert('Login failed');
      }
    }
  },
};
</script>

<style scoped>
.app-container {
    display: flex;
    height: 100vh;
}

.modal-logo img {
  width: 400px;  /* Adjust size */
  height: auto;  /* Maintain aspect ratio */
}

.sidebar {
    width: 200px;
    background-color: #f4f4f4;
    padding: 20px;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;  /* Allow scrolling */
}

.content-wrapper {
    flex-grow: 1;
    width: 100%;
    overflow-y: auto;
}

.logo {
    max-width: 200px;
    margin: 20px 0;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 400px;
}

.input-row {
    display: flex;
    gap: 10px;
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

.cancel-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 18px;
    border: none;
    background: none;
    cursor: pointer;
}
</style>
