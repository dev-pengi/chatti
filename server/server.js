console.clear();
require('dotenv').config()
const express = require('express');
const chats = require('./data/data');


const app = express();
require('./config/run')(app);


app.get('/api/chat', (req, res) => {
    res.send(chats)
})
app.get('/api/chat/:id', (req, res) => {
    const { id } = req.params
    const singleChat = chats.find(c => c._id === id)
    res.send(singleChat)
})