const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    content: { type: String, trim: true },
    URL: { type: String },
    type: { type: String, default: 'text' },
    chat: {
        type: Schema.Types.ObjectId,
        ref: "chat"
    },
}, {
    timestamps: true,
})

const message = model('message', messageSchema)
module.exports = message;