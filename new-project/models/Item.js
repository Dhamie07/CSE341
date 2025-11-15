const mongoose = require('mongoose');

// Define a simple schema for the items
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: Number,
        required: true
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;