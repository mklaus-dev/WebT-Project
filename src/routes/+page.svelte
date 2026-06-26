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

    <!-- Kreirt die 3 Auswahlbuttons, setzt den geclickten auf "activeFilter" -> state!-->
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

    <!--Liste aller Elemente in der GUI liste. Immer up to date halten!-->
    {#if activeFilter === 'Ort'}
      <ul class="list">
        {#each locations as l, i}
          <li class={selectedIndex === i ? 'active' : ''} onclick={() => selectedIndex = i}>
            {l.name}
          </li>
        {/each}
      </ul>
    {:else if activeFilter === 'Route'}
      <ul class="list">
        {#each routes as r, i}
          <li class={selectedIndex === i ? 'active' : ''} onclick={() => selectedIndex = i}>
            {r.name}
          </li>
        {/each}
      </ul>
    {:else if activeFilter === 'Wetter'}
      <ul class="list">
        {#each weatherData as w}
          <li>{w.month}: {w.temp}</li>
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
    z-index: 1000; /* Damit die Sidebar über der Karte liegt, falls nötig */
  }
  h1 {
    font-size: 1.1rem;
    margin: 0;
  }
  .filters {
    display: flex;
    gap: 0.5rem;
  }
  button {
    flex: 1;
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    font-size: 0.8rem;
  }
  button.active {
    background: #e8f5e9;
    border-color: #4caf50;
    font-weight: bold;
  }
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .list li {
    padding: 0.5rem;
    border: 1px solid #eee;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
  }
  .list li:hover {
    background: #f5f5f5;
  }
  .list li.active {
    background: #e8f5e9;
    border-color: #4caf50;
  }
  .map-container {
    flex: 1;
    height: 100%;
    position: relative;
  }
</style>