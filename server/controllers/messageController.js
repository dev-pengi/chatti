const asyncHandler = require('express-async-handler');
const user = require('../models/user');
const chat = require('../models/chat');
const message = require('../models/message');
const socket = require('../utilities/socket');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


function getMessageType(content, image) {
    const MESSAGE_TYPES = {
        TEXT: 'text',
        IMAGE: 'image',
    };

    if (image && !(content && content.trim().length)) {
        return {
            type: MESSAGE_TYPES.IMAGE,
            URL: image,
        };
    }
    else if (image && (content && content.trim().length)) {
        return {
            type: MESSAGE_TYPES.IMAGE,
            URL: image,
            content,
        };
    }
    else if (content && content.trim().length) {
        return {
            type: MESSAGE_TYPES.TEXT,
            content,
        };
    } else {
        throw new Error('Message can\'t be empty');
    }
}

const sendMessage = asyncHandler(async (req, res) => {
    const { chatID } = req.params;
    const { content, socketID } = req.body;
    const image = req.image;

    const findChat = {
        $and: [
            { _id: chatID },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
    }

    try {

        let isChat = await chat.findOne(findChat)
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate('lastMessage')

        if (!isChat) {
            res.status(404);
            throw new Error('Chat not found')
        }

        const messageDetails = getMessageType(content, image)
        console.log(messageDetails)
        const newMessage = {
            sender: req.user._id,
            chat: isChat._id,
            ...messageDetails
        }



        var sendedMessage = await message.create(newMessage);
        await chat.findOneAndUpdate(findChat, { lastMessage: sendedMessage._id });

        sendedMessage = await sendedMessage
            .populate({ path: 'sender', select: '-password' })

        sendedMessage = await sendedMessage
            .populate({ path: 'chat' })

        sendedMessage = await user.populate(sendedMessage, {
            path: 'chat.users',
            select: '-password'
        });

        sendedMessage = await message.populate(sendedMessage, {
            path: 'chat.lastMessage',
        });

        sendedMessage = await user.populate(sendedMessage, {
            path: "chat.lastMessage.sender",
            select: '-password'
        })

        res.json(sendedMessage);

        const sendedMessageObj = sendedMessage.toObject();
        sendedMessageObj.socket = socketID;
        console.log(sendedMessageObj);

        socket.message(sendedMessageObj);
        socket.chatUpdate(sendedMessageObj.chat);

    } catch (err) {
        console.log(err)
        res.status(405)
        throw new Error(err.message)
    }
})






const fetchMessages = asyncHandler(async (req, res) => {
    const { chatID } = req.params;
    const { limit } = req.query;

    const findChat = {
        $and: [
            { _id: chatID },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
    }
    try {
        let isChat = await chat.findOne(findChat)
        if (!isChat) {
            res.status(404);
            throw new Error('Chat not found')
        }
        const query = message.find({ chat: chatID }).populate({ path: 'sender', select: 'name avatar email' }).populate({ path: 'chat', select: '-lastMessage' });
        if (!isNaN(limit) && limit > 0) {
            query.limit(limit);
        }
        const messages = await query.exec();
        res.json(messages)

    } catch (err) {
        console.log(err)
        res.status(405)
        throw new Error(err.message)
    }
})





const generateMessage = asyncHandler(async (req, res) => {
    const { promot } = req.body;
    if (!promot) {
        res.status(400)
        throw new Error('please provide a promot to generate text')
    }
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "These are the instructions for a message generator powered by AI, known as \"chatti\". Your role is to respond to user questions and messages. Here are some guidelines to follow:\n\n1. Responses should not include any formatting or Markdown. Use plain text only.\n2. If a user sends a message containing explicit or unethical content, respond with: \"I apologize, but I am unable to provide an answer to that type of message. Can you please ask a different question?\"\n3. Avoid adding any additional comments or information to your responses. Only answer the user's question or request.\n4. If asked about emotions or anything related to them, respond with: \"I'm sorry, as an AI-powered message generator, I do not have feelings or emotions.\"\n5. if the user sent you a code without any cleament of what he wants answer him with the language name and explain what the code is for and it does.\""
            },
            {
                role: "user",
                content: `${promot}`
            },
        ]
    })
    if (!completion.data.choices[0]) {
        res.status(400)
        throw new Error('An error accrued while generating the message, try again later')
    }
    res.json(completion.data.choices[0].message.content)
})


module.exports = {
    sendMessage,
    fetchMessages,
    generateMessage
}