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

initSocket(io);

initAtlas(app);

console.log(`Starting Nexus on port ${PORT}`);
server.listen(PORT);