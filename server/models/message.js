const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    content: { type: Strine, trim: true, required: true },
    type: { type: Strine, default: 'text' },
    chat: {
        type: Schema.Types.ObjectId,
        ref: "chat"
    },
}, {
    timestamps: true,
})

const message = model('message', messageSchema)
module.exports = message;