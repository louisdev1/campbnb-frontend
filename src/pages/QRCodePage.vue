<template>
  <div class="qr-code-container">
    <h1>Scan the QR Code to Complete Payment</h1>
    <img src="@/assets/images/QRCodePayPal.jpg" alt="QR Code for Payment" />
  </div>
</template>

<script>
export default {
  name: "QRCodePage",
};
</script>

<style scoped>
.qr-code-container {
  text-align: center;
  margin-top: 50px;
}

.qr-code-container img {
  width: 300px;
  height: 300px;
  border: 2px solid #ccc;
  padding: 10px;
  background-color: #fff;
}
</style>
