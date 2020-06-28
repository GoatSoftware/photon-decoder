<style>
  main {
    height: 100%;
    color: white;
    display: flex;
  }

  .app {
    height: calc(100% - 70px);
    position: relative;
  }
</style>

<script>
  import Theme from "./Theme.svelte";

  import Login from "./login/Login.svelte";
  import Map from "./map/Map.svelte";
  // import Admin from "./admin/Admin.svelte";
  // import Design from "./design/Design.svelte";
  // import DesignAdd from "./design-add/DesignAdd.svelte";
  // import Request from "./request/Request.svelte";
  // import RequestAdd from "./request-add/RequestAdd.svelte";
  // import Craft from "./craft/Craft.svelte";
  // import Deliver from "./deliver/Deliver.svelte";
  import Menu from "./menu/Menu.svelte";

  let logged = false;
  let path = '';

  // const permissionMap = {
  //   '/admin': 'ADMIN',
  //   '/design': 'DESIGN',
  //   '/design/create': 'DESIGN',
  //   '/request': 'REQUEST',
  //   '/request/create': 'REQUEST',
  //   '/craft': 'CRAFT',
  //   '/gather': 'GATHER',
  //   '/deliver': 'DELIVER'
  // };

  function router() {
    const token = localStorage.getItem('jwt');
    const currentPath = parseLocation(document.location.hash);
    logged = !!token;
    if (token) {
      // const user = JSON.parse(atob(token.split('.')[1]));
      // const allowed = !!user.roles.find(i => i === permissionMap[currentPath]);
      // if (allowed) {
        path = currentPath;
      // } else {
      //   location.hash = `/${user.roles[0].toLowerCase()}`;
      // }
    }
  }

  function parseLocation(hash) {
    return hash.slice(1).toLowerCase() || "/";
  }
  
  window.addEventListener("hashchange", router);
  window.addEventListener("load", router) || router();
</script>

<main>
  {#if !logged}
    <Login></Login>
  {:else}
    <Menu logged={logged}></Menu>
    <div class="app" id="app">
      {#if path === '/map'}
        <Map></Map>
      {/if}
    </div>
  {/if}
</main>
