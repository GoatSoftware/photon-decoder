<style>
  .login {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .box {
    display: flex;
    flex-direction: column;
    padding: 30px;
    border: 1px solid hsla(40, 75%, 25%, 1);
    border-radius: 5px;
    background: hsla(0, 0%, 100%, 0.1);
  }

  .box > * {
    padding: 10px;
  }

  .submit {
    text-align: right;
  }

  input,
  button[type=submit] {
    font-family: inherit;
    padding: 0.5rem 1rem;
    border: none;
    margin: 0.5rem 0;
    background: hsla(0, 0%, 100%, 0.3);
    color: inherit;
    border-radius: 2px;
  }

  button[type=submit] {
    border: 1px solid hsla(40, 75%, 40%, 1);
    background-color: hsla(40, 75%, 25%, 1);
  }

  button[type=submit]:hover {
    background-color: hsla(40, 75%, 40%, 1);
    border: 1px solid hsla(40, 75%, 25%, 1);
  }

  .logo {
    display: block;
    font-size: 10rem;
    font-family: sans-serif;
    color: hotpink;
    text-align: center;
    position: relative;
    top: 10vh;
  }
</style>

<script>
  import { md5 } from "../lib/md5";
	let user = '';
	let password = '';
  let errors = null;
  
  function submit() {
    const url = 'http://goatsoft.es/craftia/api/login';
    const data = {
      user,
      password: md5(password)
    };
    return fetch(url, {
      method: 'POST',
      // credentials: 'include',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async r => {
      const response = await r.json();
      localStorage.setItem('jwt', r.headers.get('Authorization').substr(7));
      if (response.roles[0]) {
        location.hash = `#/${response.roles[0].toLowerCase()}`;
      }
    });
  }
</script>

<div class="logo">(&#123;&#125;)</div>
<div class="login">
  <div class="box">
    <form on:submit|preventDefault={submit}>
      <label>
        <div class="text">
          Usuario
        </div>
        <input type="text" bind:value={user}>
      </label>
      <label>
        <div class="text">
          Contraseña
        </div>
        <input type="password" bind:value={password}>
      </label>
      <div class="submit">
        <button type="submit"  disabled='{!user || !password}'>
          Login
        </button>
      </div>
    </form>
  </div>
</div>
