<script lang="ts">
  import { onMount } from 'svelte';
  import type { Connection } from './types';

  let connections: Connection[] = [];
  let filteredConnections: Connection[] = [];
  let loading = true;
  let error = '';
  let filter = '';

  onMount(async () => {
    try {
      chrome.storage.local.get('connections', (result) => {
        if (result.connections && result.connections.length > 0) {
          connections = result.connections;
          filteredConnections = result.connections;
        } else {
          error = 'No connections found. Visit your LinkedIn connections page (https://www.linkedin.com/mynetwork/invite-connect/connections/) to load data.';
        }
        loading = false;
      });
    } catch (err) {
      error = 'Failed to load connections from storage. Ensure the extension is reloaded and visit the connections page.';
      loading = false;
    }
  });

  $: if (filter) {
    filteredConnections = connections.filter(conn =>
      conn.company?.toLowerCase().includes(filter.toLowerCase())
    );
  } else {
    filteredConnections = connections;
  }
</script>

<main class="w-96 p-4 bg-white">
  <h1 class="text-xl font-bold mb-4">LinkedIn Connections</h1>

  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else}
    <input
      bind:value={filter}
      placeholder="Filter by company"
      class="w-full p-2 border rounded mb-4"
    />

    <div class="space-y-2 max-h-96 overflow-y-auto">
      {#each filteredConnections as conn}
        <div class="flex items-center p-2 border rounded">
          {#if conn.profilePicture}
            <img src={conn.profilePicture} alt={conn.name} class="w-10 h-10 rounded-full mr-3" />
          {:else}
            <div class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
          {/if}
          <div class="flex-1">
            <p class="font-semibold">{conn.name}</p>
            <p class="text-sm text-gray-600">{conn.position || conn.occupation}</p>
            <div class="flex items-center">
              {#if conn.companyLogo}
                <img src={conn.companyLogo} alt={conn.company} class="w-4 h-4 mr-1" />
              {/if}
              <p class="text-sm">{conn.company}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  /* Tailwind CSS will be injected */
</style>
