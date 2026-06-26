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

    // Map Setup
    map = L.map(mapEl).setView([49.8907, 10.88253], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    markerGroup = L.layerGroup().addTo(map);
    updateMarkers();
  });

  // Hilfsfunktion: Konvertiert das BRouter-GeoJSON in das Leaflet-Array-Format
  function extractCoordinatesFromGeoJSON(geoJson) {
    const feature = geoJson.features[0];
    if (!feature || !feature.geometry || !feature.geometry.coordinates) return [];
    
    // GeoJSON nutzt [lon, lat, ele]. Leaflet braucht [lat, lon].
    return feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
  }

  async function updateMarkers() {
    // wait funktion, damit alles im voraus lädt
    if (!map || !L || !markerGroup) return;
    markerGroup.clearLayers();


    // Sehenswürdigkeit logik
    if (filter === 'Ort') {
      const l = locations[selectedIndex];
      if (!l) return;
      
      L.marker([l.lat, l.lon])
        .addTo(markerGroup)
        .bindPopup(`<b>${l.name}</b><br>${l.description}`)
        .openPopup();


    // route logic
    } else if (filter === 'Route') {
      const r = routes[selectedIndex];
      if (!r) return;

      let leafletCoords = [];
      // const routeName = r.name; 
      const routeStart = r.start || 'Start'; // Fallback
      const routeEnd = r.end || 'Ziel';     // Fallback
      const routeDesc = r.description || ''; 

      const routeName = `${routeStart} → ${routeEnd}`;

      // Fallback i ncase reading JSON doesn't work
      if (r.file) {
        try {
          const response = await fetch(r.file);
          const geoJsonData = await response.json();
          leafletCoords = extractCoordinatesFromGeoJSON(geoJsonData);
        } catch (error) {
          console.error("Fehler beim Laden der GeoJSON-Route:", error);
          return;
        }
      } else if (r.coordinates) {
        // Fallback für alte Einträge in routes.js
        leafletCoords = r.coordinates;
      }

      if (leafletCoords.length === 0) return;

      // Start-Marker
      L.marker(leafletCoords[0])
        .addTo(markerGroup)
        .bindPopup(`<b>Start: ${routeStart}</b><br>${routeDesc}`);

      // Ziel-Marker
      L.marker(leafletCoords[leafletCoords.length - 1])
        .addTo(markerGroup)
        .bindPopup(`<b>Ziel: ${routeEnd}</b>`);

      // Linie & Autofokus
      L.polyline(leafletCoords, { color: 'red', weight: 5, opacity: 0.7 })
        .addTo(markerGroup)
        .bindPopup(`<div style="text-align: center;"><b>${routeName}</b><br>${routeDesc}</div>`)
        .openPopup();

      // Das hattest du aus Versehen gelöscht: Die Karte zentriert sich wieder auf die Route
      map.fitBounds(leafletCoords);
    }
  }

  // Svelte 5 Rune reagiert auf filter und selectedIndex Änderungen
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