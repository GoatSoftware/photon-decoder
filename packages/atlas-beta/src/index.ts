import { connect } from 'socket.io-client';

const socket = connect('http://goatsoft.es:6768');

const minX = -450;
const minY = -450;
const maxX = 450;
const maxY = 450;

socket.on('handshake', () => {
    socket.emit('handshake', {
        type: 'CONSUMER',
        token: '',
        name: 'Spezimen'
    });
    socket.on('handshakeEnd', initAtlas);
});

function initAtlas() {
    console.log('Atlas initialization');
    socket.on('aoPackage', handlePackage);
}

function handlePackage(pkg) {
    
    let point: HTMLElement = document.getElementsByClassName('point ' + pkg.name)[0] as HTMLElement;

    if (!point) {
        point = document.createElement('div');
        point.classList.add('point');
        point.classList.add(pkg.name);
        const map = document.getElementsByClassName('map')[0];
        map.appendChild(point);
    }

    const coords = {
        x: 0,
        y: 0
    };
    
    coords.x = ((pkg.aoPkg.coords[0] + maxX) * 100) / (maxX - minX);
    coords.y = ((pkg.aoPkg.coords[1] + maxY) * 100) / (maxY - minY);
    console.log(coords);
    point.style.top = `calc(${coords.y}% - 7.5px)`;
    point.style.left = `calc(${coords.x}% - 7.5px)`;
    point.style.transform = `rotate(${-1 * (pkg.aoPkg.heading + 135)}deg)`;
}
