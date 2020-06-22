import { connect } from 'socket.io-client';

const socket = connect('http://localhost:6768');

socket.on('handshake', () => {
    socket.emit('handshake', {
        type: 'CONSUMER',
        token: ''
    });
    socket.on('handshakeEnd', initAtlas);
});

function initAtlas() {
    console.log('Atlas initialization');
    
}