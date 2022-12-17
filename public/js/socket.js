var socket = io.connect('https://rockpro.me')

socket.on('redirect', (destination) => {
    window.location.href = destination;
});
// socket.emit('lol', { lol: 'lol' })