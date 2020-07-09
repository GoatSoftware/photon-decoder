import { Socket, Server } from 'socket.io';
import { User, HandshakePayload, Zone, Player } from '../types/types';

const feeders: User[] = [];
const consumers: User[] = [];
const currentState: Zone[] = [];

export function initSocket(server: Server): void {
  consumerLoop();
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
}
function consumerLoop() {
  consumers.forEach(i => {
    i.socket.emit('aoState', currentState);
  });
  setTimeout(consumerLoop, 200);
}


function validateToken(token: string) {
  return true;
}

function initFeeder(name: string, socket: Socket) {
  feeders.push({
    name,
    socket
  });
  console.log(`Feeder ${name} connected`);
  
  socket.on('aoPackage', (aoPkg) => {
    updateState(name, aoPkg);
  });
}

function initConsumer(name: string, socket: Socket) {
  console.log('Consumer connected');
  consumers.push({
    name,
    socket
  });
}

function updateState(name: string, aoPkg) {
  const playerZone = currentState.find(i => i.players.find(j => j.name === name));
  if (aoPkg.type === 'ZONE_CHANGE') {
    if (playerZone) {
      const playerIndex = playerZone.players.indexOf(playerZone.players.find(i => i.name === name));
      playerZone.players.splice(playerIndex, 1);
      if (playerZone.players.length === 0) {
        const zoneIndex = currentState.indexOf(playerZone);
        currentState.splice(zoneIndex, 1);
      }
    }
    const newZone = currentState.find(i => i.id === aoPkg.zone);

    // X and Y should be the entrance of the previous zone
    const player: Player = {
      name: name,
      x: 0,
      y: 0
    };
    if (newZone) {
      newZone.players.push(player);
    } else {
      currentState.push({
        id: aoPkg.zone,
        players: [player]
      });
    }
  }
  if (aoPkg.type === 'MOVE') {
    if (playerZone) {
      const player = playerZone.players.find(i => i.name === name);
      player.x = aoPkg.coords[0];
      player.y = aoPkg.coords[1];
    } else {
      currentState.push({
        id: 'unknown',
        players: [{
          name: name,
          x: aoPkg.coords[0],
          y: aoPkg.coords[1]
        }]
      });
    }
  }
}
