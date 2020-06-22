import { listen, Socket } from 'socket.io';
const PORT = 6768;
const server = listen(PORT);
console.log(`Starting Nexus on ${PORT}`);

const feeders: user[] = [];
const consumers: user[] = [];

interface user {
  name: string;
  socket: Socket;
}

interface HandshakePayload {
  token: string;
  type: 'FEEDER' | 'CONSUMER';
  name: string;
}

server.on('connection', function(socket) {
  socket.emit('handshake');
  socket.on('handshake', (params: HandshakePayload) => {
    if (validateToken(params.token)) {
      socket.emit('handshakeEnd');
      if (params.type === 'FEEDER') {
        initFeeder(params.name, socket);
      } else if (params.type === 'CONSUMER') {
        initConsumer(params.name, socket);
      }
    }
  });
});

function validateToken(token: string) {
  return true;
}

function initFeeder(name: string, socket: Socket) {
  feeders.push({
    name,
    socket
  });
  console.log('Feeder connected');
  
  socket.on('aoPackage', aoPackageHandler(name));
}

function initConsumer(name: string, socket: Socket) {
  console.log('Consumer connected');
  consumers.push({
    name,
    socket
  });
}

function aoPackageHandler(name: string) {
  return (aoPkg) => {
    consumers.forEach(i => {
      i.socket.emit('aoPackage', {
        name,
        aoPkg
      });
    });
    console.log(aoPkg);
  };
}
