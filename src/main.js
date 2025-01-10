import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/main.css'; // Import Tailwind CSS
import L from 'leaflet';


const app = createApp(App);
app.use(router);
app.mount('#app');


// Fix Leaflet's image path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('@/assets/images/marker-icon-2x.png'),
  iconUrl: require('@/assets/images/marker-icon.png'),
  shadowUrl: require('@/assets/images/marker-shadow.png'),
});


createApp(App).use(router);