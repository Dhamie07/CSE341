// new-project/controllers/controller.js
const Item = require('../models/Item');

// Helper function for sending 404
const handle404 = (res, id) => {
    return res.status(404).json({ message: `Item with ID ${id} not found.` });
};

// GET All - already implemented, wrapped for better error handling
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching items.', error: error.message });
    }
};

// GET Single Item (Needed for basic testing/verification, not strictly required by prompt)
const getSingleItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);

        if (!item) {
            return handle404(res, itemId);
        }
        res.status(200).json(item);
    } catch (error) {
        // CastError happens if ID format is invalid
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Item ID format.' });
        }
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

// POST Create - robust error handling added for Mongoose validation
const createItem = async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        // Handle Mongoose validation errors (e.g., required fields missing)
        if (error.name === 'ValidationError') {
            return res.status(422).json({ message: 'Validation failed.', errors: error.errors });
        }
        res.status(500).json({ message: 'Internal server error during creation.', error: error.message });
    }
};

// ---------------------------------------------
// PUT Request: Update an item
// ---------------------------------------------
const updateItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        // { new: true } returns the updated document
        const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, { 
            new: true, 
            runValidators: true // Enforce validation rules on update
        });

        if (!updatedItem) {
            return handle404(res, itemId);
        }

        // 204 No Content is common for successful updates, but 200 with data is also fine
        res.status(200).json(updatedItem); 
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(422).json({ message: 'Validation failed during update.', errors: error.errors });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Item ID format.' });
        }
        res.status(500).json({ message: 'Internal server error during update.', error: error.message });
    }
};

// ---------------------------------------------
// DELETE Request: Delete an item
// ---------------------------------------------
const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        
        const result = await Item.findByIdAndDelete(itemId);

        if (!result) {
            return handle404(res, itemId);
        }

        // 200 OK with confirmation, or 204 No Content (most common for DELETE)
        res.status(204).send(); 
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Item ID format.' });
        }
        res.status(500).json({ message: 'Internal server error during deletion.', error: error.message });
    }
};

module.exports = {
    getAllItems,
    getSingleItem, // Exporting this for completeness
    createItem,
    updateItem, // NEW
    deleteItem // NEW
};