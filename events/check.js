module.exports.user = (req, res) => {
    if (!req.user) {
        res.redirect('/login/auth/google');
        return false;
    }
    return req.user._json;
}

module.exports.user_socket = (socket) => {
    if (!socket.request.user) {
        var destination = '/login/auth/google';
        socket.emit('redirect', destination);
        return false;
    }
    return socket.request.user._json;
}
