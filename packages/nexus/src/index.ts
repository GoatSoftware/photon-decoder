import http from 'http';
import express from 'express';
import socket from 'socket.io';
import { initSocket } from './scavenger';
import { initAtlas } from './atlas';

const PORT = 6768;

const app = express();
const server = http.createServer(app);
const options = {};
const io = socket(server, options);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

initSocket(io);

initAtlas(app);

console.log(`Starting Nexus on port ${PORT}`);
server.listen(PORT);