<!--
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
-->

<script>
  import Map from '$lib/components/Map.svelte';

  let activeFilter = $state('all'); // init state
  const filters = ['alles', 'routen', 'attraktionen'];  // filters to change the website (weather needed here)
</script>

<div class="app">
  <aside class="sidebar">
    <h1>Bamberg Locations</h1>

    <!-- builds the buttons dynamically -->
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

    <ul class="list">
      <li>Bamberger Dom</li>
      <li>Fränkischer Gebirgsweg</li>
      <li>Altes Rathaus</li>
      <li>Regnitzradweg</li>
    </ul>
  </aside>

  <main class="map-container">
    <Map />
  </main>
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
    width: 100vw;
    font-family: sans-serif;
    overflow: hidden; /* Verhindert unschöne Scrollbalken am Rand */
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