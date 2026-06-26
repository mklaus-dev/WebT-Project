<script>
  import { onMount, onDestroy } from 'svelte';
  import 'leaflet/dist/leaflet.css';
  import { routes } from '$lib/data/routes.js';
  import { locations } from '$lib/data/locations.js';

  let { filter, selectedIndex } = $props();
  let mapEl;
  let map;
  let markerGroup;
  let L; // Leaflet-Instanz

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
    // wait funktion, damit alles im vorraus lädt
    if (!map || !L || !markerGroup) return;
    markerGroup.clearLayers();

    // Bamberger Dom als beispiel für Ort -> später auslagern
    if (filter === 'Ort') {
      const l = locations[selectedIndex];
      L.marker([l.lat, l.lon])
        .addTo(markerGroup)
        .bindPopup(`<b>${l.name}</b><br>${l.description}`)
        .openPopup();

    // Routen später in gpx Dateien auslagern
    } else if (filter === 'Route') {
      const r = routes[selectedIndex];

      // Start-Marker
      L.marker(r.coordinates[0])
        .addTo(markerGroup)
        .bindPopup(`<b>Start: ${r.name}</b>`)
        .openPopup();

      // Ziel-Marker
      L.marker(r.coordinates[r.coordinates.length - 1])
        .addTo(markerGroup)
        .bindPopup(`<b>Ziel: ${r.name}</b>`);

      // Linie & Autofokus
      L.polyline(r.coordinates, { color: 'red', weight: 5, opacity: 0.7 }).addTo(markerGroup);
      map.fitBounds(r.coordinates);
    }
  }

  $effect(() => {
    updateMarkers(filter, selectedIndex);
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