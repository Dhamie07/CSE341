const Item = require('../models/Item');
const User = require('../models/user'); // NEW: Import User model

// Helper function for sending 404 errors
const handle404 = (res, id, type) => {
    return res.status(404).json({ message: `${type} with ID ${id} not found.` });
};

// ==========================================
// SECTION 1: ITEM CONTROLLERS
// ==========================================

const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items.', error: error.message });
    }
};

const getSingleItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return handle404(res, req.params.id, 'Item');
        res.status(200).json(item);
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid Item ID format.' });
        res.status(500).json({ message: 'Error retrieving item.', error: error.message });
    }
};

const createItem = async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(422).json({ message: 'Validation failed.', errors: error.errors });
        }
        res.status(500).json({ message: 'Error creating item.', error: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!updatedItem) return handle404(res, req.params.id, 'Item');
        res.status(200).json(updatedItem); 
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(422).json({ message: 'Validation failed.', errors: error.errors });
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid Item ID format.' });
        res.status(500).json({ message: 'Error updating item.', error: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const result = await Item.findByIdAndDelete(req.params.id);
        if (!result) return handle404(res, req.params.id, 'Item');
        res.status(204).send(); 
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid Item ID format.' });
        res.status(500).json({ message: 'Error deleting item.', error: error.message });
    }
};

// ==========================================
// SECTION 2: USER CONTROLLERS (New Collection)
// ==========================================

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users.', error: error.message });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }); 
        
        if (!user) return handle404(res, req.params.id, 'User');
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid User ID format.' });
        res.status(500).json({ message: 'Error retrieving user.', error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(422).json({ message: 'Validation failed.', errors: error.errors });
        }
        res.status(500).json({ message: 'Error creating user.', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!updatedUser) return handle404(res, req.params.id, 'User');
        res.status(200).json(updatedUser); 
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(422).json({ message: 'Validation failed.', errors: error.errors });
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid User ID format.' });
        res.status(500).json({ message: 'Error updating user.', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) return handle404(res, req.params.id, 'User');
        res.status(204).send(); 
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid User ID format.' });
        res.status(500).json({ message: 'Error deleting user.', error: error.message });
    }
};

module.exports = {
    // Item Exports
    getAllItems,
    getSingleItem,
    createItem,
    updateItem,
    deleteItem,
    // User Exports
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser
};