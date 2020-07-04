<style>
  .map {
    display: flex;
  }

  .cluster-container {
    width: 100vh;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }

  .ne-cluster {
    top: -30vh;
    right: -30vh;
  }

  .nw-cluster {
    top: -30vh;
    left: -30vh;
  }

  .se-cluster {
    bottom: -30vh;
    right: -30vh;
  }

  .sw-cluster {
    bottom: -30vh;
    left: -30vh;
  }

  .cluster-container .cluster.side-cluster {
    position: absolute;
    width: 70%;
    height: 70%;
    cursor: pointer;
  }

  .cluster-container .cluster.side-cluster .subcluster-name {
    position: relative;
    text-align: center;
    font-size: 2.5rem;
  }

  .cluster-container .cluster.side-cluster.ne-cluster .subcluster-name {
    left: -18vh;
    transform: rotate(45deg);
    top: -18vh;
  }

  .cluster-container .cluster.side-cluster.nw-cluster .subcluster-name {
    left: 18vh;
    transform: rotate(-45deg);
    top: -18vh;
  }
  .cluster-container .cluster.side-cluster.se-cluster .subcluster-name {
    left: -19vh;
    top: -56vh;
    transform: rotate(-45deg);
  }
  .cluster-container .cluster.side-cluster.sw-cluster .subcluster-name {
    left: 19vh;
    transform: rotate(45deg);
    top: -56vh;
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
    transform: rotateY(180deg) rotateZ(135deg) scale(0.70710678118);
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  }
  .cluster .players {
    transform: rotateY(180deg) rotateZ(135deg) scale(0.70710678118);
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

  .map-options {
    width: calc(100vw - 100vh - 150px);
    border-left: 1px solid var(--basic);
    box-sizing: border-box;
    height: 100vh;
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
    max-height: calc(100% - 287px);
    overflow-y: scroll;
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
</style>

<script>
  import { getSocket } from '../lib/socket';
  import Toastify from 'toastify-js';
  import zones from '../common/zones';

  const imagesUrl = 'http://goatsoft.es/atlas/assets/maps';

  let mapInfo = {
    exits: {}
  };
  let players = [];
  let currentState;

  let destinationZone;
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
		mapInfo = await (await fetch(`http://goatsoft.es/atlas/api/v1/${id}.json`, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'*'
      }})).json();
  }

  function zoneClick(exit) {
    moveToMap(mapInfo.exits[exit].id);
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
    fetchMapInfo(3004);
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
    return currentState.reduce((acc, i) => {
      return acc.concat(i.players);
    }, []);
  }

  function resumeTracking() {
    pausedTracking = false;
  }

  function setDestination(destination) {
    destinationZone = destination;
  }

  function trackPlayer(player) {
    selectedPlayer = player;
  }

  function filteredZones(zones, filter) {
    return zones.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));
  }

  initMap();

</script>

<div class="map">
  {#if mapInfo.id}
    <div class="cluster-container">
      <div class="cluster">
        <div class="players">
          {#each players as player}
            <div class={`player ${player.name}`} style={ `top: ${player.style.top}; left: ${player.style.left}; transform: ${player.style.transform};` } title={player.name}></div>
          {/each}
        </div>
        <img src="{imagesUrl}/{mapInfo.id}.png" alt="" />
      </div>
      <div on:click={() => zoneClick('NE')} class="ne-cluster cluster side-cluster {mapInfo.exits.NE && mapInfo.exits.NE.type}">
        {#if mapInfo.exits.NE}
          <img src="{imagesUrl}/{mapInfo.exits.NE.id}.png" alt="" />
          <div class="subcluster-name">{mapInfo.exits.NE.name}</div>
        {/if}
      </div>
      <div on:click={() => zoneClick('NW')} class="nw-cluster cluster side-cluster {mapInfo.exits.NW && mapInfo.exits.NW.type}">
        {#if mapInfo.exits.NW}
          <img src="{imagesUrl}/{mapInfo.exits.NW.id}.png" alt="" />
          <div class="subcluster-name">{mapInfo.exits.NW.name}</div>
        {/if}
      </div>
      <div on:click={() => zoneClick('SE')} class="se-cluster cluster side-cluster {mapInfo.exits.SE && mapInfo.exits.SE.type}">
        {#if mapInfo.exits.SE}
          <img src="{imagesUrl}/{mapInfo.exits.SE.id}.png" alt="" />
          <div class="subcluster-name">{mapInfo.exits.SE.name}</div>
        {/if}
      </div>
      <div on:click={() => zoneClick('SW')} class="sw-cluster cluster side-cluster {mapInfo.exits.SW && mapInfo.exits.SW.type}">
        {#if mapInfo.exits.SW}
          <img src="{imagesUrl}/{mapInfo.exits.SW.id}.png" alt="" />
          <div class="subcluster-name">{mapInfo.exits.SW.name}</div>
        {/if}
      </div>
    </div>
  {/if}
  <div class="map-options">
    <div class="title">{mapInfo.name}</div>
    <div class="selected-info">
      <div class="selected zone">
        <div>
          &nbsp;
          {#if destinationZone}
            Direcciones a: {zones.find(i => i.id === destinationZone.toString()).name}
          {/if}
        </div>
        <div class="actions">
          {#if destinationZone}
            <button on:click={() => {setDestination('')}}>Borrar destino</button>
          {:else}
            <button on:click={() => {setDestination(mapInfo.id)}}>Direcciones a este mapa</button>
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
        <input type="text" bind:value={mapFilter}>

        {#each filteredZones(zones, mapFilter) as zone}
          <div>
            <span on:click={() => moveToMap(zone.id)}>{zone.name}</span><span on:click={() => setDestination(zone.id)}>Dest</span>
          </div>
        {/each}
      {:else if selectedOption === 'player'}
        {#each allPlayers() as player}
          <div>
            <span on:click={() => trackPlayer(player.name)}>
              {player.name}
            </span>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>