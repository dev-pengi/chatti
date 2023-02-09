const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
    name: { type: String, trim: true },
    isGroup: { type: Boolean, default: false },
    avatar: { type: String, },
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