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
const { setupSocket } = require('./utilities/socket');
setupSocket(server);

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

//socket
