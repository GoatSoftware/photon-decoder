<script>
	import { onMount } from 'svelte';
	import Menu from './Menu.svelte';
  import Zone from './Zone.svelte';
  
  let mapInfo;

  let id = '3004';
  const hash = location.hash;
  id = hash.split('#')[1] || id;
  
	async function fetchZone() {
		mapInfo = await (await fetch(`http://localhost:5000/api/v0/${id}.json`, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'*'
      }})).json();
  }

  function handleMove({detail: item}) {
    console.log(item);
    id = item.to.id;
    location.hash = id;
    fetchZone();
  }

	onMount(async () => {
    fetchZone();
	});
  
</script>

<main>
	<div class="app">
    {#if mapInfo}
      <div class="zone-container">
        <Zone on:move={handleMove} mapInfo={mapInfo}></Zone>
      </div>
      <div class="menu-container">
        <Menu map={mapInfo.name}></Menu>
      </div>
    {/if}
	</div>
</main>
