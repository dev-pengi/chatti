const User = require('../models/user');
const Chat = require('../models/chat');
const jwt = require('jsonwebtoken');

let io;
const setupSocket = (server) => {
    io = require('socket.io')(server, {
        pingTimeout: 60000,
        cors: {
            origin: "http://localhost:3000"
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
                socket.emit("connected");
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

const chatUpdate = (oldChat, newChat) => {
    const oldUsers = oldChat.users.map(u => u._id)
    const newUsers = newChat.users.map(u => u._id)
    const users = [...oldUsers.filter(u => !newUsers.includes(u)), ...newUsers.filter(u => !oldUsers.includes(u))];
    console.log(oldUsers)
    console.log(newUsers)
    console.log(users)
    for (let i = 0; i < users.length; i++) {
        io.to(users[i].toString()).emit('chatUpdate', newChat);
    }
}

const chatCreate = (chat) => {
    const users = chat.users.map(u => u._id);
    for (let i = 0; i < users.length; i++) {
        io.to(users[i].toString()).emit('chatCreate', chat);
        console.log(`emit to ${i}`)
    }
}



module.exports = {
    setupSocket,
    message,
    chatUpdate,
    chatCreate
}