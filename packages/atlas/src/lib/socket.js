import { connect } from 'socket.io-client';

let socket;

export function getSocket() {
  return new Promise((resolve) => {
    if (!socket) {
      socket = connect('http://goatsoft.es:6768');
  
      socket.on('handshake', () => {
        socket.emit('handshake', {
          type: 'CONSUMER',
          token: ''
        });
        socket.on('handshakeEnd', () => {
          resolve(socket);
        });
      });
    } else {
      resolve(socket);
    }
  });
}
