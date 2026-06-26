<script>
  import Map from '$lib/components/map.svelte';
  import { weatherData } from '$lib/data/weather.js';
  import { routes } from '$lib/data/routes.js';
  import { locations } from '$lib/data/locations.js';

  let activeFilter = $state('Ort');
  let selectedIndex = $state(0);
  const filters = ['Ort', 'Route', 'Wetter'];

  function setFilter(f) {
    activeFilter = f;
    selectedIndex = 0; // zurück auf erstes Element beim Wechsel
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
      Quelle: www.timeanddate.de
      <ul class="list">
        {#each weatherData as w, i (w.month || i)}
          <li class="weather-item">{w.month}: {w.temp}</li>
        {/each}
      </ul>
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

  /* Eigenes Styling für die Wetter-Liste, da hier nur Text ohne Buttons steht */
  .weather-item {
    padding: 0.5rem;
    border: 1px solid #eee;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  /* --- Karten-Container --- */
  .map-container {
    flex: 1;
    height: 100%;
    position: relative;
  }
</style>