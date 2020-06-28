<style>
  .logo {
    margin: 25px 0;
    background-image: url(../assets/logoatsoft.png);
    width: 100%;
    background-size: contain;
    height: 100px;
    background-repeat: no-repeat;
    background-position: center;
    box-sizing: border-box;
  }

  nav {
    position: relative;
    z-index: 20;
    background: var(--basic);
    display: flex;
    align-items: center;
    box-shadow: 0 0 2px 0 white;
    height: 100%;
    flex-direction: column;
    width: 150px;
    margin-right: 1px;
  }

  nav .option {
    padding: 25px;
    color: inherit;
    text-decoration: none;
    white-space: break-spaces;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  nav .option.selected {
    background-color: var(--basic);
  }

  nav .option:hover {
    cursor: pointer;
    background: var(--basic);
  }

  nav .option.selected:hover {
    background-color: var(--double);
  }

  .logout:hover {
    cursor: pointer;
    background: var(--basic);
  }

  .bottom-menu {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    text-align: right;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }

  .brand {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }

  .dropdown {
    position: relative;
    width: 100%;
    left: 0;
    text-align: center;
    padding: 25px;
    box-sizing: border-box;
    text-transform: capitalize;
  }

  .dropdown:hover {
    background-color: var(--basic);
  }

  .dropdown .options {
    position: absolute;
    bottom: 0;
    transition: width 500ms ease;
    background-color: var(--basic);
    width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    left: calc(100% + 1px);
  }

  .dropdown:hover .options {
    width: 100%;
  }

  .dropdown .option {
    padding: 15px;
  }

  .changePasswordModal input {
    margin-bottom: 20px;
  }
</style>

<script>
  import { md5 } from "../lib/md5";
  import Toastify from 'toastify-js'
  import Modal from "../common/Modal.svelte";

  let options = {};
  let nav;
  let currentOption;
  let user;
  let changePasswordModal = false;
  let password;
  let repeatPassword;

  export let logged;
  $: if (logged !== undefined) {
    logged = JSON.parse(logged);
    const token = localStorage.getItem('jwt');
    if (token) {
      const userInfo = JSON.parse(atob(token.split('.')[1]));
      user = userInfo.username;
      const roles = userInfo.roles;
      options = {};
      for(let rol of roles) {
        options[rol.toLowerCase()] = true;
      }
    }
  }

  function parseLocation(hash) {
    return hash.slice(1).toLowerCase() || "/";
  }

  function logout() {
    localStorage.removeItem('jwt');
    location.hash = '';
  }

  function updateCurrentOption() {
    const hash = parseLocation(location.hash);
    currentOption = hash.split('/')[1];
  }

  function changePassword() {
    changePasswordModal = true;
  }

  function closePasswordModal() {
    changePasswordModal = false;
    password = '';
    repeatPassword = '';
  }

  function savePassword() {
    const url = 'http://goatsoft.es/craftia/api/changePassword';
    const token = localStorage.getItem('jwt');

    const data = {
      password: md5(password)
    };
    fetch(url, {
      method: 'POST',
      // credentials: 'include',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      }
    })
    .then((r) => {
      changePasswordModal = false;
      if (r.status !== 200) {
        Toastify({
          text: 'Ha ocurrido un error actualizando la contraseña',
          selector: 'app',
          backgroundColor: 'linear-gradient(135deg, #981b1b, #6c1313)'
        }).showToast();
        return;
      }
      Toastify({
        text: 'Contraseña cambiada con éxito',
        selector: 'app',
        backgroundColor: 'linear-gradient(135deg, #6e981b, #4f6c13)'
      }).showToast();
    });
  }
  
  window.addEventListener("hashchange", updateCurrentOption);
  window.addEventListener("load", updateCurrentOption);
</script>

{#if logged}
  <nav bind:this={nav}>
    <div class="logo"></div>
    <a href="#/map" class={(currentOption === 'map' ? 'selected ' : '') + 'option map'}>Mapa</a>
    <div class="bottom-menu">
      <div class="dropdown">
        {user}
        <div class="options">
          <div class="option" on:click={changePassword}>Cambiar Password</div>
          <div class="option" on:click={logout}>Logout</div>
        </div>
      </div>
      <div class="brand">
        <div>Albion online</div>
        <div>Goatsoft</div>
      </div>
    </div>
  </nav>
  <Modal open={changePasswordModal} on:close={closePasswordModal}>
    <div class="changePasswordModal">
      <form on:submit|preventDefault={savePassword}>
        <label>
          <div class="text">
            Contraseña
          </div>
          <input name="newPassword" type="password" bind:value={password}>
        </label>
        <label>
          <div class="text">
            Repetir contraseña
          </div>
          <input name="newPasswordRepeat" type="password" bind:value={repeatPassword}>
        </label>
        <div class="submit">
          <button type="submit" disabled='{!password || !repeatPassword || password !== repeatPassword}'>
            Guardar
          </button>
        </div>
      </form>
    </div>
  </Modal>
{/if}