<script>
  import Map from '$lib/components/map.svelte';
  // import { weatherData } from '$lib/data/weather.js';
  import { routes } from '$lib/data/routes.js';
  import { locations } from '$lib/data/locations.js';

  let activeFilter = $state('Ort');
  let selectedIndex = $state(0);
  const filters = ['Ort', 'Route', 'Wetter'];

  let liveWeather = $state(null);
  let loadingWeather = $state(false);

  async function setFilter(f) {
    activeFilter = f;
    selectedIndex = 0; // zurück auf erstes Element beim Wechsel

    if (f === 'Wetter' && !liveWeather) {
      loadingWeather = true;
      try {
        const response = await fetch('/api/weather'); // Aufruf unseres Backends
        liveWeather = await response.json();
      } catch (err) {
        console.error("Backend nicht erreichbar:", err);
      } finally {
        loadingWeather = false;
      }
    }
  }
</script>

<div class="app">
  <aside class="sidebar">
    <h1>Bamberg Locations</h1>

    <div class="filters">
      {#each filters as filter}
        <button
          class={activeFilter === filter ? 'active' : ''}
          onclick={() => setFilter(filter)}
        >
          {filter}
        </button>
      {/each}
    </div>

    {#if activeFilter === 'Ort'}
      <ul class="list">
        {#each locations as l, i (l.name || i)}
          <li>
            <button 
              class={selectedIndex === i ? 'active' : ''} 
              onclick={() => selectedIndex = i}
              type="button"
            >
              {l.name}
            </button>
          </li>
        {/each}
      </ul>
    {:else if activeFilter === 'Route'}
      <ul class="list">
        {#each routes as r, i (r.name || i)}
          <li>
            <button 
              class={selectedIndex === i ? 'active' : ''} 
              onclick={() => selectedIndex = i}
              type="button"
            >
            <!-- &rarr to get the -> symbol to load -->
              {#if r.start && r.end}
                {r.start} &rarr; {r.end}
              {:else}
                {r.name}
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    {:else if activeFilter === 'Wetter'}
      <ul class="list">
        {#if loadingWeather}
          <li class="weather-info">Lade Live-Daten vom Backend...</li>
        {:else if liveWeather && liveWeather.success}
          <!-- Schleife durch die 7 Tage -->
          {#each liveWeather.forecast as w, i (w.date || i)}
            <li>
              <button 
                class="weather-btn {w.isCurrent ? 'current-day' : ''}" 
                type="button"
              >
                <div class="weather-row">
                  <span class="weather-day">{w.day} <small>({w.date})</small></span>
                  <span class="weather-temp">{w.temp}</span>
                </div>
              </button>
            </li>
          {/each}
        {:else}
          <li class="weather-info error">Fehler beim Laden der Backend-Daten.</li>
        {/if}
      </ul>

      <!-- Das reduzierte Ampel-Textfeld direkt unter der Liste -->
      {#if liveWeather && liveWeather.success && !loadingWeather}
        <div class="weather-summary">
          <div class="verdict {liveWeather.summary.status}">
            {liveWeather.summary.verdictText}
          </div>
        </div>
      {/if}
    {/if}
  </aside>

  <main class="map-container">
    <Map filter={activeFilter} selectedIndex={selectedIndex} />
  </main>
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
    width: 100vw;
    font-family: sans-serif;
    overflow: hidden;
  }
  .sidebar {
    width: 260px;
    padding: 1rem;
    background: #fff;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 1000;
  }
  h1 {
    font-size: 1.1rem;
    margin: 0;
  }
  
  /* --- Filter-Buttons ganz oben --- */
  .filters {
    display: flex;
    gap: 0.5rem;
  }
  .filters button {
    flex: 1;
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    font-size: 0.8rem;
  }
  .filters button.active {
    background: #e8f5e9;
    border-color: #4caf50;
    font-weight: bold;
  }

  /* --- Liste (Ort / Route / Wetter) --- */
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  /* Das li selbst hat keinen Rahmen/Padding mehr, das übernimmt der Button */
  .list li {
    padding: 0;
    border: none;
  }
  /* Buttons innerhalb der Liste stylen (ersetzt das alte .list li) */
  .list button {
    width: 100%;
    text-align: left;
    padding: 0.5rem;
    border: 1px solid #eee;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    background: transparent;
  }
  .list button:hover {
    background: #f5f5f5;
  }
  .list button.active {
    background: #e8f5e9;
    border-color: #4caf50;
    font-weight: bold;
    color: initial; /* Verhindert, dass der Button Standard-Textfarben erzwingt */
  }

  /* --- Karten-Container --- */
  .map-container {
    flex: 1;
    height: 100%;
    position: relative;
  }

  /* --- Zusätzliche Wetter-Styles --- */
  
  /* Basis-Layout für das Text-Innere des Wetter-Buttons */
  .weather-row {
    display: flex;
    justify-content: space-between; /* Drückt Wochentag nach links, Gradzahl nach rechts */
    align-items: center;
    width: 100%;
  }

  .weather-day small {
    color: #777;
    font-size: 0.75rem;
    margin-left: 0.2rem;
  }

  .weather-temp {
    font-weight: bold;
  }

  /* Die farbliche Markierung für die "Aktuell / Heute" Zeile */
  .list button.current-day {
    background: #e3f2fd; /* Ein sanftes Info-Blau */
    border-color: #2196f3;
    color: #0d47a1;
  }
  
  .list button.current-day:hover {
    background: #bbdefb;
  }

  /* Styles für Lade- und Fehlermeldungen in der Liste */
  .weather-info {
    padding: 0.7rem;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
  }
  
  .weather-info.error {
    color: #d32f2f;
    background: #ffebee;
    border-radius: 6px;
  }

  /* --- Styling für das Wetter-Fazit-Textfeld --- */
  .weather-summary {
    margin-top: 1rem;
    /* Padding entfernt, damit die farbige Box die volle Breite nutzt */
  }

  .verdict {
    font-size: 1.05rem;
    font-weight: bold;
    text-align: center;
    padding: 0.75rem 0.5rem; /* Etwas mehr vertikales Padding für bessere Lesbarkeit */
    border-radius: 6px;
  }

  /* Grün (Ja) */
  .verdict.good {
    background: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #a5d6a7;
  }

  /* Rot (Nein) */
  .verdict.bad {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ef9a9a;
  }

  /* Gelb/Orange (Vielleicht) */
  .verdict.maybe {
    background: #fff3e0; /* Sanftes, unaufdringliches Orange-Gelb */
    color: #e65100;
    border: 1px solid #ffcc80;
  }
</style>