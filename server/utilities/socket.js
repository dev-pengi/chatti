const User = require('../models/user');
const Chat = require('../models/chat');
const jwt = require('jsonwebtoken');

let io;
const setupSocket = (server) => {
    console.log(server)
    io = require('socket.io')(server, {
        // pingTimeout: 60000,
        cors: {
            origin: ["https://www.chatti.lol", "https://chatti.lol", "http://www.chatti.lol", "http://chatti.lol"],
            methods: ["GET", "POST"],
        }
    })
    console.log(io)

    console.log("setting up the socket...");

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