<style>
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
  .point {
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
  import { getSocket } from '../lib/socket';
  // import Toastify from 'toastify-js'

  const imagesUrl = 'http://goatsoft.es/atlas/assets/maps';

  let mapInfo = {
    exits: {}
  };

  async function fetchMapInfo(id) {
    mapInfo = {
      id: id,
      exits: {}
    }
		mapInfo = await (await fetch(`http://goatsoft.es/atlas/api/v1/${id}.json`, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'*'
      }})).json();
  }

  function zoneClick(exit) {
    fetchMapInfo(mapInfo.exits[exit].id);
  }

  async function initMap() {
    const socket = await getSocket();

    initAtlas(socket);
  }

  function initAtlas(socket) {
      console.log('Atlas initialization');
      socket.on('aoPackage', handlePackage);
      fetchMapInfo(3004);
  }

  function handlePackage(pkg) {
      
    let point = document.getElementsByClassName('point ' + pkg.name)[0];

    if (!point) {
      point = document.createElement('div');
      point.classList.add('point');
      point.classList.add(pkg.name);
      const map = document.getElementsByClassName('map')[0];
      map.appendChild(point);
    }

    const coords = {
      x: 0,
      y: 0
    };

    const maxX = mapInfo.mapBounds[1][0];
    const minX = mapInfo.mapBounds[0][0];
    const maxY = mapInfo.mapBounds[1][1];
    const minY = mapInfo.mapBounds[0][1];
    
    coords.x = ((pkg.aoPkg.coords[0] + maxX) * 100) / (maxX - minX);
    coords.y = ((pkg.aoPkg.coords[1] + maxY) * 100) / (maxY - minY);
    console.log(coords);
    point.style.top = `calc(${coords.y}% - 7.5px)`;
    point.style.left = `calc(${coords.x}% - 7.5px)`;
    point.style.transform = `rotate(${-1 * (pkg.aoPkg.heading + 135)}deg)`;
  }

  initMap();

</script>

<div class="map">
  {#if mapInfo.id}
    <div class="cluster-container">
      <div class="cluster">
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
</div>