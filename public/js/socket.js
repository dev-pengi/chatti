var socket = io.connect('http://localhost:5000')

socket.on('redirect', (destination) => {
    window.location.href = destination;
});
// socket.emit('lol', { lol: 'lol' })