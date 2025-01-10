<template>
  <div>
    <!-- Login Button -->
    <button class="login-button" @click="$emit('openModal')">Login</button>

    <!-- Left Menu -->
    <div class="menu">
      <button @click="$router.push('/')" class="menu-button">Home</button>
      <button @click="$router.push('/map')" class="menu-button">Map</button>
      <button @click="$router.push('/addspotpage')" class="menu-button">Profile</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageButtons",
};
</script>

<style scoped>
.login-button {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.menu {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  min-width: 150px;
}

.menu-button {
  background: transparent;
  border: none;
  color: black;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

.menu-button:hover {
  background-color: #4caf50;
  color: white;
}
</style>
