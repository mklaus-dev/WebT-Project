<script>
  import { onMount, onDestroy } from 'svelte';
  import 'leaflet/dist/leaflet.css';

  let mapEl;
  let map;

  onMount(async () => {
    // 1. Leaflet erst hier dynamisch laden (wird nur im Browser ausgeführt)
    const L = await import('leaflet');

    // 2. Die Marker-Icons importieren und zuweisen
    const markerIcon = (await import('leaflet/dist/images/marker-icon.png')).default;
    const markerIconRetina = (await import('leaflet/dist/images/marker-icon-2x.png')).default;
    const markerShadow = (await import('leaflet/dist/images/marker-shadow.png')).default;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIconRetina,
      shadowUrl: markerShadow,
    });

    // 3. Karte wie gewohnt initialisieren (L.default abfangen, falls das Bundling es verlangt)
    const leafletInstance = L.default || L;
    
    map = leafletInstance.map(mapEl).setView([49.8907, 10.88253], 15);

    
    leafletInstance.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    
    leafletInstance.marker([49.8907, 10.88253])
      .addTo(map)
      .bindPopup('<b>Bamberger Dom</b><br>Sehenswürdigkeit')
      .openPopup();
  });

  onDestroy(() => {
    map?.remove();
  });
</script>

<div bind:this={mapEl} class="map"></div>

<style>
  .map {
    width: 100%;
    height: 100%; 
    min-height: 100vh; 
  }
</style>