const mongoose = require("mongoose");

const contact = new mongoose.Schema({
    // public data
    id: { type: String, required: true, unique: true },
    messages: { type: Array, default: [] },
});

module.exports = mongoose.model('contacts', contact)