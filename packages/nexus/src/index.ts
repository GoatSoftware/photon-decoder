import { listen, Socket } from 'socket.io';
const PORT = 6768;
const server = listen(PORT);
console.log(`Starting Nexus on ${PORT}`);

const feeders: Socket[] = [];
const consumers: Socket[] = [];


interface HandshakePayload {
  token: string;
  type: 'FEEDER' | 'CONSUMER';
}

server.on('connection', function(socket) {
  socket.emit('handshake');
  socket.on('handshake', (params: HandshakePayload) => {
    if (validateToken(params.token)) {
      socket.emit('handshakeEnd');
      if (params.type === 'FEEDER') {
        initFeeder(socket);
      } else if (params.type === 'CONSUMER') {
        initConsumer(socket);
      }
    }
  });
});

function validateToken(token: string) {
  return true;
}

function initFeeder(socket: Socket) {
  feeders.push(socket);
  console.log('Feeder connected');
  
  socket.on('aoPackage', aoPackageHandler);
}

function initConsumer(socket: Socket) {
  console.log('Consumer connected');
  consumers.push(socket);
}

function aoPackageHandler(aoPkg) {
  consumers.forEach(i => {
    i.emit('aoPackage', aoPkg);
  });
  console.log(aoPkg);
}
