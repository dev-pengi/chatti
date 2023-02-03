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
const mediaRoutes = require('./routes/mediaRoutes')

//configs
require('./config/run')(app);

//middlewares
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const imgurUploadMiddleware = require('./middleware/uploadMiddleware');

//express routes
app.use(fileupload());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(imgurUploadMiddleware);

//requests routes
app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)
// app.use('/api/media', mediaRoutes)

app.use(notFound)
app.use(errorHandler)