import { listen, Socket } from 'socket.io';
const server = listen(3000);

interface HandshakePayload {
  token: string;
  type: 'FEEDER' | 'CONSUMER';
}

server.on('connection', function(socket) {
  socket.emit('handshake');
  socket.on('handshake', (params: HandshakePayload) => {
    if (validateToken(params.token)) {
      if (params.type === 'FEEDER') {
        initFeeder(socket);
      } else if (params.type === 'CONSUMER') {
        initConsumer(socket);
      }
    }
  });
});

function validateToken(token: string) {
  console.log(token);
  
  return true;
}

function initFeeder(socket: Socket) {
  socket.on('aoPackage', aoPackageHandler);
}

function initConsumer(socket: Socket) {
  socket.emit('aoPackage', {});
}

function aoPackageHandler(aoPkg) {
  console.log(aoPkg);
}
