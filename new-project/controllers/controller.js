const Item = require('../models/Item');

// GET Request: Retrieve all items
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST Request: Create a new item
const createItem = async (req, res) => {
    try {
        // req.body contains the JSON data sent by the client
        const newItem = new Item(req.body);
        await newItem.save();
        
        // 201 Created status
        res.status(201).json(newItem); 
    } catch (error) {
        // 400 Bad Request status for validation errors
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllItems,
    createItem
};