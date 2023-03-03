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



        // socket.on('message', async (message) => {
        //     const chatID = message.chat;
        //     const findChat = await Chat.findOne({ _id: chatID })
        //         .populate('users', "-password")
        //         .populate("groupAdmin", "-password")
        //     if (!findChat) return;
        //     const users = findChat.users.map(u => u._id)
        //     console.log(users)
        //     for (let i = 0; i < users.length; i++) {
        //         io.to(users[i].toString()).emit('message', message);
        //         console.log(`emited to user: ${i}`)
        //     }
        // })
    });

    // return {
    //     sendMessage: (users, message) => {
    //         if (!users || !message) return;
    //         for (let i = 0; i < users.length; i++) {
    //             socket.to(users[i]).emit('message', message);
    //         }
    //         return `message has been sent to ${users.length} in the chat`;
    //     }
    // }
}


const emitMessage = (message) => {
    const users = message.chat.users.map(u => u._id)
    console.log(users)
    for (let i = 0; i < users.length; i++) {
        io.to(users[i].toString()).emit('message', message);
        console.log(`emited to user: ${i}`)
    }
}



module.exports = { setupSocket, emitMessage }