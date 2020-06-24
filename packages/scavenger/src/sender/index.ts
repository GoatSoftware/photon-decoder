import { AoPackage } from '../translator';
import { connect, Socket } from 'socket.io-client';

let socket: typeof Socket;

export function init(user: string): Promise<boolean> {
  let connected = false;
  return new Promise((resolve) => {
    console.log('connecting');

    socket = connect('http://goatsoft.es:6768');
    socket.on('handshake', () => {
      console.log('received handshake');
      socket.emit('handshake', {
        type: 'FEEDER',
        token: '',
        name: user
      });
      socket.on('handshakeEnd', () => {
        console.log('handshake end');
        connected = true;
        resolve(true);
      });
    });
    setTimeout(() => {
      if (!connected) {
        console.log('not connected');
        resolve(false);
      }
    }, 3000);
  });
}

export function send(pkg: AoPackage): void {
  console.log(pkg);
  socket.emit('aoPackage', pkg);
}
