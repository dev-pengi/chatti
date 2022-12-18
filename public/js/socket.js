var socket = io.connect('/')

socket.on('redirect', (destination) => {
    window.location.href = destination;
});
// socket.emit('lol', { lol: 'lol' })