const User = require('../models/user');
const jwt = require('jsonwebtoken');

let io;
const setupSocket = (server) => {
    io = require('socket.io')(server, {
        pingTimeout: 60000,
        cors: {
            origin: ["https://www.chatti.lol", "https://chatti.lol", "http://www.chatti.lol", "http://chatti.lol","http://localhost:3000"],
            methods: ["GET", "POST"],
        }
    })


    io.on("connection", (socket) => {
        console.log("new client connected");
        socket.on("authenticate", async (token) => {
            try {
                const JWT_KEY = process.env.JWT_KEY;
                const decoded = jwt.verify(token, JWT_KEY);
                const user = await User.findById(decoded.id).select("-password");
                socket.join(user._id.toString());
                socket.emit("connected", socket.id);
            } catch (err) {
                console.error(err);
                socket.disconnect();
            }
        });

    });
}


const message = (message) => {
    const users = message.chat.users.map(u => u._id)
    for (let i = 0; i < users.length; i++) {
        io.to(users[i].toString()).emit('message', message);
    }
}

const chatUpdate = (newChat) => {
    const users = newChat.users.map(u => u._id)
    for (let i = 0; i < users.length; i++) {
        io.to(users[i].toString()).emit('chatUpdate', newChat);
    }
}

const chatCreate = (chat) => {
    const users = chat.users.map(u => u._id);
    for (let i = 0; i < users.length; i++) {
        io.to(users[i].toString()).emit('chatCreate', chat);
    }
}

const chatRemove = (chat, users) => {
    for (let i = 0; i < users.length; i++) {
        io.to(users[i].toString()).emit('chatRemove', chat);
    }
}



module.exports = {
    setupSocket,
    message,
    chatUpdate,
    chatCreate,
    chatRemove,
}