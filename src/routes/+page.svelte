<script>
  import Map from '$lib/components/Map.svelte';

  // Start-Filter, Buttons und Wetterdaten
  let activeFilter = $state('Ort'); 
  const filters = ['Ort', 'Route', 'Wetter'];

  // Wetterdaten zum einfachen ändern in Skript verlagert
  const weatherData = [
    { month: 'Januar', temp: '2°C' },
    { month: 'Februar', temp: '4°C' },
    { month: 'März', temp: '9°C' },
    { month: 'April', temp: '14°C' },
    { month: 'Mai', temp: '19°C' },
    { month: 'Juni', temp: '22°C' },
    { month: 'Juli', temp: '25°C' },
    { month: 'August', temp: '24°C' },
    { month: 'September', temp: '19°C' }
  ];
</script>

<div class="app">
  <aside class="sidebar">
    <h1>Bamberg Locations</h1>

    <!-- Kreirt die 3 Auswahlbuttons, setzt den geclickten auf "activeFilter" -> state!-->
    <div class="filters">
      {#each filters as filter}
        <button
          class={activeFilter === filter ? 'active' : ''} 
          onclick={() => activeFilter = filter}
        >
          {filter}
        </button>
      {/each}
    </div>

    <!--Liste aller Elemente in der GUI liste. Immer up to date halten!-->
    {#if activeFilter === 'Ort'}
      <ul class="list">
        <li>Bamberger Dom</li>
      </ul>
    {:else if activeFilter === 'Route'}
      <ul class="list">
        <li>Erbaweg zum Schlenkerla</li>
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
    <Map filter={activeFilter} />
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

  .map-container {
    flex: 1;
    height: 100vh; /* Erzwingt, dass die Karte Platz einnimmt */
    position: relative;
  }
</style>