const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// GET /items
router.get('/', controller.getAllItems);

// POST /items
router.post('/', controller.createItem);

module.exports = router;