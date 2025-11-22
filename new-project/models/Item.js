// new-project/models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    // Field 1
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true
    },
    // Field 2
    value: {
        type: Number,
        required: [true, 'Value is required.'],
        min: [0, 'Value must be a positive number.'],
        validate: {
            validator: Number.isInteger,
            message: 'Value must be an integer.'
        }
    },
    // Field 3: Description
    description: {
        type: String,
        required: [true, 'Description is required.'],
        minlength: [10, 'Description must be at least 10 characters.']
    },
    // Field 4: Category
    category: {
        type: String,
        enum: ['Electronics', 'Books', 'Clothing', 'Other'], // Validation: Must be one of these
        default: 'Other'
    },
    // Field 5: Stock Quantity
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative.']
    },
    // Field 6: SKU (Stock Keeping Unit)
    sku: {
        type: String,
        required: [true, 'SKU is required']
    },
    // Field 7: Active Status
    isActive: {
        type: Boolean,
        default: true
    }
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;