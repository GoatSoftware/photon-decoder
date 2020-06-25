<script>
  import { createEventDispatcher } from 'svelte';
  
  export let mapInfo;

  const mapsUrl = 'assets/maps';

	const dispatch = createEventDispatcher();
  
  function zoneClick(direction) {
		dispatch('move', {
			to: mapInfo.exits[direction]
		});
  }
</script>

<style>

  .map-container {
    width: 100vh;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }

  .ne-map {
    top: -30vh;
    right: -30vh;
  }

  .nw-map {
    top: -30vh;
    left: -30vh;
  }

  .se-map {
    bottom: -30vh;
    right: -30vh;
  }

  .sw-map {
    bottom: -30vh;
    left: -30vh;
  }

  .map-container .map.side-map {
    position: absolute;
    width: 70%;
    height: 70%;
  }

  .map-container .map.side-map .submap-name {
    position: relative;
    text-align: center;
    font-size: 2.5rem;
  }

  .map-container .map.side-map.ne-map .submap-name {
    left: -18vh;
    transform: rotate(45deg);
    top: -18vh;
  }

  .map-container .map.side-map.nw-map .submap-name {
    left: 18vh;
    transform: rotate(-45deg);
    top: -18vh;
  }
  .map-container .map.side-map.se-map .submap-name {
    left: -19vh;
    top: -56vh;
    transform: rotate(-45deg);
  }
  .map-container .map.side-map.sw-map .submap-name {
    left: 19vh;
    transform: rotate(45deg);
    top: -56vh;
  }

  .map-container .map.side-map {
    text-shadow: 0 0 5px black;
  }

  .map-container .map.side-map .submap-name:after,
  .map-container .map.side-map .submap-name:before {
    content: '▲'
  }

  .map-container .map.side-map .submap-name:after,
  .map-container .map.side-map .submap-name:before {
    content: '▼'
  }

  .map-container .map.side-map.BLACK,
  .map-container .map.side-map.CITY_BLACK {
    color: black;
  }

  .map-container .map.side-map.RED {
    color: red;
  }

  .map-container .map.side-map.YELLOW {
    color: yellow;
  }

  .map-container .map.side-map.BLUE,
  .map-container .map.side-map.STARTINGCITY,
  .map-container .map.side-map.CITY_BLUE {
    color: blue;
  }

  .map-container .map img {
    transform: rotateY(180deg) rotateZ(135deg) scale(0.70710678118);
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  }
</style>

<div class="map-container">
  <div class="map">
    <img src="{mapsUrl}/{mapInfo.id}.png" alt="" />
  </div>
  <div on:click={() => zoneClick('NE')} class="ne-map map side-map {mapInfo.exits.NE && mapInfo.exits.NE.type}">
    {#if mapInfo.exits.NE}
      <img src="{mapsUrl}/{mapInfo.exits.NE.id}.png" alt="" />
      <div class="submap-name">{mapInfo.exits.NE.name}</div>
    {/if}
  </div>
  <div on:click={() => zoneClick('NW')} class="nw-map map side-map {mapInfo.exits.NW && mapInfo.exits.NW.type}">
    {#if mapInfo.exits.NW}
      <img src="{mapsUrl}/{mapInfo.exits.NW.id}.png" alt="" />
      <div class="submap-name">{mapInfo.exits.NW.name}</div>
    {/if}
  </div>
  <div on:click={() => zoneClick('SE')} class="se-map map side-map {mapInfo.exits.SE && mapInfo.exits.SE.type}">
    {#if mapInfo.exits.SE}
      <img src="{mapsUrl}/{mapInfo.exits.SE.id}.png" alt="" />
      <div class="submap-name">{mapInfo.exits.SE.name}</div>
    {/if}
  </div>
  <div on:click={() => zoneClick('SW')} class="sw-map map side-map {mapInfo.exits.SW && mapInfo.exits.SW.type}">
    {#if mapInfo.exits.SW}
      <img src="{mapsUrl}/{mapInfo.exits.SW.id}.png" alt="" />
      <div class="submap-name">{mapInfo.exits.SW.name}</div>
    {/if}
  </div>
</div>
