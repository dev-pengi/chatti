const mongoose = require("mongoose");

const user = new mongoose.Schema({

    // public data
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, default: null },
    email: { type: String, default: null },
    contacts: { type: Array, default: [] },

    banned: { type: Boolean, default: false }
});

module.exports = mongoose.model('users', user)