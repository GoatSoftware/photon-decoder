<style>
  .search {
    width: 100%;
    height: 100%;
  }

  .items {
    padding: 15px;
    overflow-y: auto;
    border: 1px solid var(--basic);
    margin-top: 15px;
    width: 100%;
    height: calc(100% - 45px);
    box-sizing: border-box;
  }

  .item {
    display: flex;
    font-size: 18px;
    border-bottom: 1px solid var(--basic);
  }

  .search-fields {
    display: flex;
  }

  .search-fields > div {
    margin-left: 20px;
  }

  .search-fields > div:first-child {
    margin-left: 0;
  }

  .item:last-child {
    border-bottom: none;
  }

  .item .image {
    width: 100px;
    height: 90px;
  }

  .item .image img {
    width: 90px;
  }

  .item .info {
    padding: 15px 0;
  }

  .search input {
    width: 295px;
  }

  .search select {
    width: 100px;
  }

  .search select option {
    background: rgba(0, 0, 0, 0.7);
  }
</style>

<script>
	import { createEventDispatcher } from 'svelte';

  let items = [];
  let search = '';
  let tier;
  let slot;
  let timer;
  
	const dispatch = createEventDispatcher();

	const debounce = v => {
		clearTimeout(timer);
		timer = setTimeout(() => {
      search = v;
			requestItems();
		}, 500);
  }
  
  function requestItems() {
    if (search.length >= 3 || tier && slot) {
      const query = search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const url = 'http://goatsoft.es/craftia/api/items';
      const token = localStorage.getItem('jwt');
      const params = [];
      if (query) {
        params.push(`q=${query}`);
      }
      if (tier) {
        params.push(`t=${tier}`);
      }
      if (slot) {
        params.push(`s=${slot}`);
      }
  
      fetch(url + `?${params.join('&')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      }).then(async r => {
        items = (await r.json());
      });
    }
  }

  function selectItem(item) {
    dispatch('select', {
      item
    })
  }
</script>

<div class="search">
  <div class="search-fields">
    <div class="name">
      <div class="search-input">
        Buscar:
        <input on:keyup={({ target: { value } }) => debounce(value)} />
      </div>
    </div>
    <div class="tier">
      <div class="search-input">
        Tier:
        <select bind:value={tier} on:change="{requestItems}">
          <option value=""></option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
      </div>
    </div>
    <div class="slot">
      <div class="search-input">
        Pieza:
        <select bind:value={slot} on:change="{requestItems}">
          <option value=""></option>
          <option value="head">Casco</option>
          <option value="armor">Armadura</option>
          <option value="shoes">Zapato</option>
          <option value="mainhand">Arma</option>
          <option value="offhand">Mano izquierda</option>
          <option value="cape">Capa</option>
          <option value="bag">Bolsa</option>
        </select>
      </div>
    </div>
  </div>
  <div class="items">
    {#each items as item}
      <div on:click={() => selectItem(item)} class="item">
        <div class="image">
          <img src={`http://goatsoft.es/craftia/static/items/${item.id}.png`} alt="">
        </div>
        <div class="info">
          {item.name['ES-ES']}
        </div>
      </div>
    {/each}
  </div>
</div>