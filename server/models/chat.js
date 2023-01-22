const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
    chatName: { type: String, trim: true },
    isGroup: { type: Boolean, default: false },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
    ],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "message"
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true,
})

const chat = model('chat', chatSchema)
module.exports = chat;