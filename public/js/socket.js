var socket = io.connect('http://localhost:5000')

socket.on('redirect', (destination) => {
    window.location.href = destination;
});
socket.on('message', data => {
    console.log(data);
});

// socket.emit('lol', { lol: 'lol' })