const router = require('express').Router();

// This is the intended "Hello World!" route for localhost:3000/
router.get('/', (req, res) => {
    res.send('Hello World!');
});

// This mounts the contacts router for all paths starting with /contacts
router.use('/contacts', require('./contacts'));

module.exports = router;