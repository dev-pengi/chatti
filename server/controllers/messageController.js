const asyncHandler = require('express-async-handler');
const user = require('../models/user');
const chat = require('../models/chat');
const message = require('../models/message');



const sendMessage = asyncHandler(async (req, res) => {
    const { chatID } = req.params;
    const { content } = req.body;

    try {

        let isChat = await chat.findOne({
            $and: [
                { _id: chatID },
                { users: { $elemMatch: { $eq: req.user._id } } }
            ]
        })

        if (!isChat) {
            res.status(404);
            throw new Error('Chat not found')
        }
        if (!content || !content.trim.length) {
            res.status(400);
            throw new Error('Message can\'t be empty')
        }

        var newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatID
        }

    } catch (err) {
        res.status(405)
        throw new Error(err.message)
    }


})



module.exports = {
    sendMessage
}