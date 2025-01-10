<template>
  <div class="login-container">
    <h1>Login</h1>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>

    <button @click="showForgotPassword = true" class="forgot-password-btn">Forgot Password?</button>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="modal-overlay">
      <div class="modal-content">
        <h2>Reset Password</h2>
        <input v-model="resetEmail" type="email" placeholder="Enter your email" />
        <button @click="requestPasswordReset">Send Reset Link</button>
        <button @click="showForgotPassword = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      showForgotPassword: false,
      resetEmail: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password
        });
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
        this.$router.push('/');
      } catch (error) {
        alert('Invalid email or password.');
      }
    },
    async requestPasswordReset() {
      try {
        await axios.post('http://localhost:3000/api/auth/forgot-password', {
          email: this.resetEmail,
        });
        alert('If the email exists, a reset link has been sent.');
        this.showForgotPassword = false;
      } catch (error) {
        console.error('Error sending reset link:', error);
        alert('Failed to send reset link.');
      }
    }
  }
};
</script>

<style scoped>
.forgot-password-btn {
  background-color: transparent;
  color: #007bff;
  border: none;
  cursor: pointer;
  margin-top: 10px;
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
