<script>
  import { onMount, onDestroy } from 'svelte';
  import 'leaflet/dist/leaflet.css';

  let { filter } = $props();

  let mapEl;
  let map;
  let markerGroup;
  let L; // Leaflet-Instanz

  // Feste Geodaten, momentan Erba-Schlenkerla
  const routeCoordinates = [
    [49.9032, 10.8691],
    [49.9018, 10.8715],
    [49.9000, 10.8732],
    [49.8973, 10.8770],
    [49.8955, 10.8794],
    [49.8933, 10.8837],
    [49.8916, 10.8850]
  ];

  onMount(async () => {
    const leafletModule = await import('leaflet');
    L = leafletModule.default || leafletModule;

    // Icon-Fix kompakt
    const icon = (await import('leaflet/dist/images/marker-icon.png')).default;
    const iconRetina = (await import('leaflet/dist/images/marker-icon-2x.png')).default;
    const shadow = (await import('leaflet/dist/images/marker-shadow.png')).default;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({ iconUrl: icon, iconRetinaUrl: iconRetina, shadowUrl: shadow });

    // Map Setup -> imported
    map = L.map(mapEl).setView([49.8907, 10.88253], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    
    markerGroup = L.layerGroup().addTo(map);
    updateMarkers();
  });

  function updateMarkers() {
    if (!map || !L || !markerGroup) return;
    markerGroup.clearLayers();

    // Bamberger Dom als beispiel für Ort -> später auslagern
    if (filter === 'Ort') {
      L.marker([49.8907, 10.88253])
        .addTo(markerGroup)
        .bindPopup('<b>Bamberger Dom</b><br>Sehenswürdigkeit')
        .openPopup();

    // Routen später in gpx Dateien auslagern
    } else if (filter === 'Route') {
      // Start-Marker (Erba)
      L.marker(routeCoordinates[0])
        .addTo(markerGroup)
        .bindPopup('<b>Start: Erba-Insel</b><br>Hier geht die Route los')
        .openPopup();

      // Ziel-Marker (Schlenkerla)
      L.marker(routeCoordinates[routeCoordinates.length - 1])
        .addTo(markerGroup)
        .bindPopup('<b>Ziel: Schlenkerla</b><br>Historische Brauerei');

      // Linie & Autofokus
      L.polyline(routeCoordinates, { color: 'red', weight: 5, opacity: 0.7 }).addTo(markerGroup);
      map.fitBounds(routeCoordinates);
    }
  }

  $effect(() => {
    updateMarkers(filter); 
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
  }
</style>