import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import HomePage from '../pages/HomePage.vue';
import AddSpotPage from '../pages/AddSpotPage.vue';
import SettingsPage from '../pages/SettingsPage.vue';
import AddCampingSpot from '../pages/AddCampingSpot.vue';
import BookingPage from '../pages/BookingPage.vue';
import MapPage from '../pages/MapPage.vue';
import PaymentPage from '../pages/PaymentPage.vue';
import QRCodePage from '../pages/QRCodePage.vue';
import BookingHistoryPage from '../pages/BookingHistoryPage.vue';
import FutureBookings from '../pages/FutureBookings.vue';


const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/addspotpage', component: AddSpotPage },
  { path: '/settings', component: SettingsPage },  
  { path: '/addspot', component: AddCampingSpot },
  { path: '/book/:id', component: BookingPage },
  { path: '/map', component: MapPage },
  { path: '/payment', component: PaymentPage },
  { path: '/', component: HomePage },
  {
    path: '/qr-code',
    name: 'QRCodePage',
    component: QRCodePage
  },
  { path: '/bookings', component: BookingHistoryPage },
  { path: '/future-bookings', component: FutureBookings }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
