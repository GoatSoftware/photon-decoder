<style>
  .cluster-container {
    width: 100vh;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }

  .cluster {
    transform: rotate(-135deg) scale(0.70710678118);
  }

  .ne-cluster {
    top: -30%;
    right: -30%;
  }

  .nw-cluster {
    top: -30%;
    left: -30%;
  }

  .se-cluster {
    bottom: -30%;
    right: -30%;
  }

  .sw-cluster {
    bottom: -30%;
    left: -30%;
  }

  .cluster-container .cluster.side-cluster {
    position: absolute;
    width: 70%;
    height: 70%;
    cursor: pointer;
  }

  .cluster-container .cluster.side-cluster .subcluster-name {
    position: absolute;
    text-align: center;
    font-size: 2.5rem;
    line-height: 3rem;
    width: 100%;
  }

  .cluster-container .cluster.side-cluster.ne-cluster .subcluster-name {
    left: 0;
    transform: rotate(180deg);
    bottom: 100%;
  }

  .cluster-container .cluster.side-cluster.nw-cluster .subcluster-name {
    top: calc(50% - 1.5rem);
    right: calc(50% - -1.5rem);
    transform: rotate(90deg);
  }
  .cluster-container .cluster.side-cluster.se-cluster .subcluster-name {
    bottom: calc(50% - 1.5rem);
    left: calc(50% - -1.5rem);
    transform: rotate(90deg);
  }
  .cluster-container .cluster.side-cluster.sw-cluster .subcluster-name {
    right: 0;
    transform: rotate(180deg);
    top: 100%;
  }

  .cluster-container .cluster.side-cluster.ne-cluster .subcluster-name:after,
  .cluster-container .cluster.side-cluster.ne-cluster .subcluster-name:before,
  .cluster-container .cluster.side-cluster.nw-cluster .subcluster-name:after,
  .cluster-container .cluster.side-cluster.nw-cluster .subcluster-name:before {
    content: '▲'
  }

  .cluster-container .cluster.side-cluster.se-cluster .subcluster-name:after,
  .cluster-container .cluster.side-cluster.se-cluster .subcluster-name:before,
  .cluster-container .cluster.side-cluster.sw-cluster .subcluster-name:after,
  .cluster-container .cluster.side-cluster.sw-cluster .subcluster-name:before {
    content: '▼'
  }

  
  .cluster-container .cluster.side-cluster.destination-path .subcluster-name:after,
  .cluster-container .cluster.side-cluster.destination-path .subcluster-name:before {
    color: white;
    animation: blink 500ms alternate infinite;
  }

  @keyframes blink {
    0%   {opacity: 1;}
    100% {opacity: 0;}
  }

  .cluster-container .cluster.side-cluster.BLACK,
  .cluster-container .cluster.side-cluster.CITY_BLACK {
    color: hsla(0, 0%, 70%, 1);
  }

  .cluster-container .cluster.side-cluster.RED {
    color: hsla(0, 100%, 70%, 1);
  }

  .cluster-container .cluster.side-cluster.YELLOW {
    color: hsla(60, 100%, 70%, 1);
  }

  .cluster-container .cluster.side-cluster.BLUE,
  .cluster-container .cluster.side-cluster.STARTINGCITY,
  .cluster-container .cluster.side-cluster.CITY_BLUE {
    color: hsla(240, 100%, 70%, 1);
  }

  .cluster-container .cluster img {
    transform: rotateY(180deg);
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  }
  .cluster .players {
    transform: rotateY(180deg);
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 15;
  }

  .cluster .players .player {
    width: 10px;
    height: 10px;
    border-radius: 0 50% 50% 50%;
    border: 3px solid black;
    transform: rotate(45deg);
    margin-top: 5px;
    position: absolute;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';
  
  const imagesUrl = `${environment.STATIC_URL}/assets/maps`;
  
  const dispatch = createEventDispatcher();
  
  export let mapInfo;
  export let players;
  export let nextExit;

  function zoneClick(direction) {
    dispatch('zoneClick', {
      direction
    });
  }
</script>

<div class="cluster-container">
  <div class="cluster">
    <div class="players">
      {#each players as player}
        <div class={`player ${player.name}`} style={ `top: ${player.style.top}; left: ${player.style.left}; transform: ${player.style.transform};` } title={player.name}></div>
      {/each}
    </div>
    <img src="{imagesUrl}/{mapInfo.id}.png" alt="" />
  </div>
  <div on:click={() => zoneClick('NE')} class="ne-cluster cluster side-cluster {mapInfo.exits.NE && mapInfo.exits.NE.type} {nextExit === 'NE' ? 'destination-path' : ''}">
    {#if mapInfo.exits.NE}
      <img src="{imagesUrl}/{mapInfo.exits.NE.id}.png" alt="" />
      <div class="subcluster-name">{mapInfo.exits.NE.name}</div>
    {/if}
  </div>
  <div on:click={() => zoneClick('NW')} class="nw-cluster cluster side-cluster {mapInfo.exits.NW && mapInfo.exits.NW.type} {nextExit === 'NW' ? 'destination-path' : ''}">
    {#if mapInfo.exits.NW}
      <img src="{imagesUrl}/{mapInfo.exits.NW.id}.png" alt="" />
      <div class="subcluster-name">{mapInfo.exits.NW.name}</div>
    {/if}
  </div>
  <div on:click={() => zoneClick('SE')} class="se-cluster cluster side-cluster {mapInfo.exits.SE && mapInfo.exits.SE.type} {nextExit === 'SE' ? 'destination-path' : ''}">
    {#if mapInfo.exits.SE}
      <img src="{imagesUrl}/{mapInfo.exits.SE.id}.png" alt="" />
      <div class="subcluster-name">{mapInfo.exits.SE.name}</div>
    {/if}
  </div>
  <div on:click={() => zoneClick('SW')} class="sw-cluster cluster side-cluster {mapInfo.exits.SW && mapInfo.exits.SW.type} {nextExit === 'SW' ? 'destination-path' : ''}">
    {#if mapInfo.exits.SW}
      <img src="{imagesUrl}/{mapInfo.exits.SW.id}.png" alt="" />
      <div class="subcluster-name">{mapInfo.exits.SW.name}</div>
    {/if}
  </div>
</div>