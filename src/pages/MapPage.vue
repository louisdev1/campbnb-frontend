<template>
  <div id="map" style="height: 100vh; width: 100%;"></div>
</template>

<script>
import axios from 'axios';
import { Loader } from '@googlemaps/js-api-loader';

let googleMapsLoader = null;

export default {
  data() {
    return {
      spots: [],
      map: null,
    };
  },
  async mounted() {
    await this.fetchSpots();
    this.initMap();
  },
  methods: {
    // Fetch the camping spots with coordinates
    async fetchSpots() {
      try {
        const response = await axios.get('http://localhost:3000/api/spots/all-with-ratings');
        this.spots = response.data.filter(spot => spot.Latitude && spot.Longitude);  // ❗ Exclude spots without coordinates
        console.log('Fetched spots for map:', this.spots);  // ✅ Debug
      } catch (error) {
        console.error('Error fetching map spots:', error);
      }
    },

    // Initialize Google Maps
    initMap() {
      if (!googleMapsLoader) {
        googleMapsLoader = new Loader({
          apiKey: 'AIzaSyBYiHdhd4T79GVyznFfrPvPnWDyf72lvzo',  // ✅ API Key
          version: 'weekly',
        });
      }

      googleMapsLoader.load().then(() => {
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 50.8503, lng: 4.3517 },  // Brussels
          zoom: 7,
        });

        this.addMarkers();  // ✅ Add markers after the map is initialized
      });
    },

    // Add markers for each camping spot
    addMarkers() {
      if (!this.map) {
        console.error('Map not initialized');
        return;
      }

      this.spots.forEach((spot) => {
        // ✅ Ensure latitude and longitude are numbers
        const lat = parseFloat(spot.Latitude);
        const lng = parseFloat(spot.Longitude);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Invalid coordinates for spot: ${spot.Name}`);
          return;  // Skip spots with invalid coordinates
        }

        // ✅ Create marker
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          title: spot.Name,
        });

        // ✅ Create InfoWindow
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3>${spot.Name}</h3>
              <p>${spot.Address}, ${spot.City}, ${spot.Country}</p>
              <p><strong>Price:</strong> €${spot.PricePerNight} / night</p>
              <p><strong>Features:</strong> ${spot.Features}</p>
            </div>
          `,
        });

        // ✅ Show InfoWindow on click
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
      });

      console.log('Markers added to the map');
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>
