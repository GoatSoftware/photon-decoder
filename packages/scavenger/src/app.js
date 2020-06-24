import "./stylesheets/main.css";

// Small helpers you might want to keep
import "./helpers/context_menu.js";
import "./helpers/external_links.js";
import { md5 } from "./helpers/md5";
import { init as initSender, send } from './sender';
import sniffer from './sniffer';
import decodePackage from './decoder';
import { knownPackages, translatePackage } from './translator';
import { map, filter } from 'rxjs/operators';

// ----------------------------------------------------------------------------
// Everything below is just to show you how it works. You can delete all of it.
// ----------------------------------------------------------------------------

// import { remote } from "electron";
// import jetpack from "fs-jetpack";
// import { greet } from "./hello_world/hello_world";
// import env from "env";

// const app = remote.app;
// const appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
// const manifest = appDir.read("package.json", "json");

// const osMap = {
//   win32: "Windows",
//   darwin: "macOS",
//   linux: "Linux"
// };

load();

async function load() {
  const remember = localStorage.getItem('remember');
  if (remember) {
    const user = localStorage.getItem('user');
    const password = localStorage.getItem('password');
    const passwordLength = localStorage.getItem('passwordLength');

    document.getElementById('user').value = user;
    document.getElementById('password').value = ' '.repeat(parseInt(passwordLength));
    document.getElementById('remember').checked = remember;
  }
}

async function login() {
  const savedRemember = localStorage.getItem('remember');
  const remember = document.getElementById('remember').checked;
  const user = document.getElementById('user').value;
  const password = savedRemember ? localStorage.getItem('password') : md5(document.getElementById('password').value);
  const passwordLength = document.getElementById('password').value.length;
  if (remember) {
    localStorage.setItem('user', user);
    localStorage.setItem('password', password);
    localStorage.setItem('passwordLength', passwordLength);
    localStorage.setItem('remember', remember);
  }
  try {
    const u = await submit(user, password);
    console.log(u);
    hideLogin();
    startScavenge(user);
  } catch (e) {

  }
}

function hideLogin() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('randomMessages').style.display = 'block';
}

function startScavenge(user) {
  initSender(user)
    .then(connected => {
      if (connected) {
        sniffer()
          .pipe(
            map(decodePackage),
            filter(knownPackages),
            map(translatePackage)
          )
          .subscribe(pkg => {
            send(pkg);
          });
      }
    });
  loadRandomMessages();
}

function loadRandomMessages() {
  const messages = [
    'Rebuscando en la basura',
    'Paseando por un descampado',
    'Pescando en el puerto',
    'Analizando escombros',
    'Desperdigando el ripio'
  ];
  document.getElementById('randomMessages').textContent = messages[Math.round(Math.random() * (messages.length - 1))];
  setTimeout(loadRandomMessages, 60000);
}

function submit(user, password) {
  const url = 'http://goatsoft.es/craftia/api/login';
  const data = {
    user,
    password: password
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
    return response;
  });
}

function updateRemember() {
  if (!document.getElementById('remember').checked) {
    localStorage.removeItem('password');
    localStorage.removeItem('remember');
    localStorage.removeItem('passwordLength');
    document.getElementById('password').value = '';
  }
}

document.getElementById('login').onclick = login;
document.getElementById('remember').onchange = updateRemember;

document.querySelector("#app").style.display = "block";
// document.querySelector("#greet").innerHTML = greet();
// document.querySelector("#os").innerHTML = osMap[process.platform];
// document.querySelector("#author").innerHTML = manifest.author;
// document.querySelector("#env").innerHTML = env.name;
// document.querySelector("#electron-version").innerHTML =
  process.versions.electron;
