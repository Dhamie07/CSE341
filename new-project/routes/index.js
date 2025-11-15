// new-project/routes/index.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Base path routes (e.g., /items)
router.get('/', controller.getAllItems);
router.post('/', controller.createItem);

// Routes requiring an ID parameter (e.g., /items/:id)
router.get('/:id', controller.getSingleItem); // Optional, but good practice
router.put('/:id', controller.updateItem);   // NEW: Update route
router.delete('/:id', controller.deleteItem); // NEW: Delete route

module.exports = router;