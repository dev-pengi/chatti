console.clear();
require('dotenv').config()

//express
const express = require('express');
const app = express();
const fileupload = require("express-fileupload");
const bodyparser = require("body-parser")

//routes
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')

const { PORT } = process.env;
//configs
require('./config/run')();
const server = app.listen(PORT, () => {
    console.log(`Server is runnig on ${PORT}`.green);
})

//middlewares
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/user');

//express routes
app.use(fileupload());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//requests routes
app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)

app.use(notFound)
app.use(errorHandler)

// auth
const jwt = require('jsonwebtoken');

//socket
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})


io.on("connection", (socket) => {
    console.log("new client connected");
    // Add the user to the room as soon as the socket connection is established
    socket.on("authenticate", async (token) => {
        console.log('checking')
        try {
            const JWT_KEY = process.env.JWT_KEY;
            const decoded = jwt.verify(token, JWT_KEY);
            const user = await User.findById(decoded.id).select("-password");
            socket.join(user._id);
            socket.emit("connected");
        } catch (err) {
            console.error(err);
            socket.disconnect();
        }
    });

    socket.on('joinChat', (chat) => {
        socket.join(chat)
        console.log(`A user has joind the chat: ${chat}`)
    })

    socket.on('message', (message) => {
        const chatRoom = message.chat._id;
        
        io.to(chatRoom).emit('message', message);
    })
});




