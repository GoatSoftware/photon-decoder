import { connect } from 'socket.io-client';

const socket = connect('http://192.168.1.39:6768');

const minX = -450;
const minY = -450;
const maxX = 450;
const maxY = 450;

let point: HTMLElement;

socket.on('handshake', () => {
    socket.emit('handshake', {
        type: 'CONSUMER',
        token: ''
    });
    socket.on('handshakeEnd', initAtlas);
});

function initAtlas() {
    console.log('Atlas initialization');
    socket.on('aoPackage', handlePackage);
    point = document.getElementsByClassName('point')[0];
}

function handlePackage(pkg) {
    const coords = {
        x: 0,
        y: 0
    };
    
    coords.x = ((pkg.coords[0] + maxX) * 100) / (maxX - minX);
    coords.y = ((pkg.coords[1] + maxY) * 100) / (maxY - minY);
    console.log(coords);
    point.style.top = `calc(${coords.y}% - 10px)`;
    point.style.left = `calc(${coords.x}% - 10px)`;
    point.style.transform = `rotate(${-1 * (pkg.heading + 135)}deg)`;
}