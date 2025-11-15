// new-project/models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'], // Added required validation message
        trim: true
    },
    value: {
        type: Number,
        required: [true, 'Value is required.'], // Added required validation message
        min: [0, 'Value must be a positive number.'], // Added minimum value validation
        validate: {
            validator: Number.isInteger,
            message: 'Value must be an integer.'
        }
    }
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;