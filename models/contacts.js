const mongoose = require("mongoose");

const contact = new mongoose.Schema({
    // public data
    id1: { type: String, required: true },
    id2: { type: String, required: true },
    messages: { type: Array, default: [] },
});

module.exports = mongoose.model('contacts', contact)