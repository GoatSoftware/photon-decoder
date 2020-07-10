<style>
  .map {
    display: flex;
  }

  .map-options {
    width: calc(100vw - 100vh - 150px);
    border-left: 1px solid var(--basic);
    box-sizing: border-box;
    height: 100vh;
    overflow: hidden;
  }

  .map-options .title {
    text-align: center;
    font-size: 3rem;
    background-color: var(--basic);
    padding: 20px;
  }

  .map-options .options {
    padding: 20px 20px 0 20px;
    font-size: 0;
  }
  .map-options .options button {
    width: calc(50% - 10px);
    margin-right: 20px;
  }

  .map-options .options button:last-child {
    margin-right: 0;
  }

  .selected-info {
    display: flex;
    padding: 20px 20px 0 20px;
  }

  .selected-info .selected {
    width: calc(50% - 10px);
    margin-right: 20px;
  }

  .selected-info .selected:last-child {
    margin-right: 0;
  }

  .map-options .selected-option {
    padding: 20px;
    max-height: calc(100% - 288px);
    overflow-y: auto;
  }

  .map-options .selected-option .zone-search {
    width: 200px;
  }
  
  .actions {
    margin-top: 20px;
    font-size: 0;
  }

  .actions button {
    width: 100%;
  }

  .actions.double button {
    width: calc(50% - 10px);
    margin-right: 20px;
  }

  .actions.double button:last-child {
    margin-right: 0;
  }

  .list {
    margin-top: 20px;
  }

  .list .item {
    display: flex;
    align-items: center;
    padding: 5px;
    border-bottom: 1px solid var(--basic);
  }

  .list .item .icon {
    margin-right: 20px;
  }

  .list .item .name {
    cursor: pointer;
    width: 200px;
  }

  .list .item .unknown {
    margin-left: 48px;
  }

  .list .item:last-child {
    border-bottom: none;
  }

</style>

<script>
  import { getSocket } from '../lib/socket';
  import Toastify from 'toastify-js';
  import zones from '../common/zones';
  import Icon from '../common/Icon.svelte';
  import Cluster from './Cluster.svelte';

  let mapInfo = {
    exits: {}
  };
  let players = [];
  let currentState;

  let destinationZone;
  let nextExit;
  let selectedPlayer = '';
  let selectedOption = '';
  let pausedTracking = false;
  let mapFilter = '';

  async function fetchMapInfo(id) {
    const currentZone = zones.find(i => i.id === id.toString());
    mapInfo = {
      id: id,
      name: currentZone && currentZone.name,
      exits: {}
    }
		mapInfo = await (await fetch(`${environment.STATIC_URL}/api/v1/${id}.json`)).json();
    fetchDirections();
  }

  function zoneClick(event) {
    moveToMap(mapInfo.exits[event.detail.direction].id);
  }

  function moveToMap(id) {
    if (selectedPlayer && !pausedTracking) {
      pausedTracking = true;
      Toastify({
        text: `Se ha pausado el seguimiento de ${selectedPlayer}`,
        selector: 'app',
        backgroundColor: 'linear-gradient(135deg, #981b1b, #6c1313)'
      }).showToast();
    }
    fetchMapInfo(id);
  }

  async function initMap() {
    const socket = await getSocket();

    initAtlas(socket);
  }

  function initAtlas(socket) {
    console.log('Atlas initialization');
    socket.on('aoState', handlePackage);
    fetchMapInfo(4000);
  }

  async function handlePackage(pkg) {
    currentState = pkg;
    if (mapInfo && mapInfo.mapBounds) {
      const currentMap = currentState.find(i => i.id === mapInfo.id);
      if (selectedPlayer && !pausedTracking && (!currentMap || !currentMap.players.find(i => i.name === selectedPlayer))) {
        const playerMap = currentState.find(i => !!i.players.find(j => j.name === selectedPlayer));
        if (playerMap) {
          await fetchMapInfo(playerMap.id);
        } else {
          Toastify({
            text: `No se encuentra al jugador ${selectedPlayer}`,
            selector: 'app',
            backgroundColor: 'linear-gradient(135deg, #981b1b, #6c1313)'
          }).showToast();
          selectedPlayer = '';
        }
      }
      const minX = mapInfo.mapBounds[0][0];
      const minY = mapInfo.mapBounds[0][1];
      const maxX = mapInfo.mapBounds[1][0];
      const maxY = mapInfo.mapBounds[1][1];

      if (currentMap) {
        players = currentMap.players.map(i => {
          const coords = {
            x: ((i.x + maxX) * 100) / (maxX - minX),
            y: ((i.y + maxY) * 100) / (maxY - minY)
          };
          return {
            name: i.name,
            style: {
              top: `calc(${coords.y}% - 7.5px)`,
              left: `calc(${coords.x}% - 7.5px)`,
              transform: `rotate(${-1 * (i.heading + 135)}deg)`
            }
          };
        });
      } else {
        players = [];
      }
    }
  }

  function optionSearch(option) {
    selectedOption = option;
  }

  function allPlayers() {
    const x = currentState.reduce((acc, i) => {
      return acc.concat(i.players.map(j => ({...j, zone: zones.find(k => k.id === i.id.toString())})));
    }, []);
    
    return x;
  }

  function resumeTracking() {
    pausedTracking = false;
  }

  function setDestination(destination) {
    destinationZone = destination;
    fetchDirections();
  }

  function trackPlayer(player) {
    selectedPlayer = player;
  }

  function filteredZones(zones, filter) {
    return zones.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));
  }

  async function fetchDirections() {
    nextExit = '';
    if (mapInfo.id && destinationZone) {
      const directions = await (await fetch(`${environment.API_URL}/path?from=${mapInfo.id}&to=${destinationZone}`)).json();
      if (directions[1]) {
        nextExit = directions[1].dir;
      }
    }
  }

  initMap();

</script>

<div class="map">
  {#if mapInfo.id}
    <Cluster mapInfo={mapInfo} players={players} nextExit={nextExit} on:zoneClick={zoneClick}></Cluster>
  {/if}
  <div class="map-options">
    <div class="title">{mapInfo.name}</div>
    <div class="selected-info">
      <div class="selected zone">
        <div>
          &nbsp;
          {#if destinationZone}
            Indicaciones para: {zones.find(i => i.id === destinationZone.toString()).name}
          {/if}
        </div>
        <div class="actions">
          {#if destinationZone}
            <button on:click={() => {setDestination('')}}>Borrar destino</button>
          {:else}
            <button on:click={() => {setDestination(mapInfo.id)}}>Indicaciones a este mapa</button>
          {/if}
        </div>
      </div>
      <div class="selected player">
        {#if selectedPlayer}
          <div>
            Seguimiento de: {selectedPlayer} {#if pausedTracking}(pausado){/if}
          </div>
          <div class="actions {pausedTracking ? 'double' : '' }">
            {#if pausedTracking}
              <button on:click={resumeTracking}>Reanudar</button>
            {/if}
            <button on:click={() => trackPlayer('')}>Dejar de seguir</button>
          </div>
        {/if}
      </div>
    </div>
    <div class="options">
      <button on:click={() => {optionSearch('zone')}}>Buscar zona</button>
      <button on:click={() => {optionSearch('player')}}>Buscar jugador</button>
    </div>
    <div class="selected-option">
      {#if selectedOption === 'zone'}
        <input class="zone-search" type="text" placeholder="Buscar" bind:value={mapFilter}>
        <div class="list">
          {#each filteredZones(zones, mapFilter) as zone}
            <div class="item">
              <span class="icon" on:click={() => setDestination(zone.id)}><Icon name="gps"></Icon></span>
              <span class="name" on:click={() => moveToMap(zone.id)}>{zone.name}</span>
            </div>
          {/each}
        </div>
      {:else if selectedOption === 'player'}
        <div class="list">
          {#each allPlayers() as player}
            <div class="item">
              <span class="name" on:click={() => trackPlayer(player.name)}>
                {player.name}
              </span>
              <span class="zone">
                {#if player.zone}
                  <span class="icon" on:click={() => setDestination(player.zone.id)}><Icon name="gps"></Icon></span>
                  <span class="name" on:click={() => moveToMap(player.zone.id)}>{player.zone.name}</span>
                {:else}
                  <span class="unknown">
                    Desconocido
                  </span>
                {/if}
              </span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>