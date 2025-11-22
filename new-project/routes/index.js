const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/controller');
const { isAuthenticated } = require('../middleware/authenticate'); // Import middleware

// ------------------------------------
// NEW: Root Route (The Home Page)
// ------------------------------------
router.get('/', (req, res) => {
    // Check if the user is in the session (logged in)
    if (req.session.user !== undefined) {
        // If logged in:
        res.send(`Login successful. Welcome, ${req.session.user.displayName || req.session.user.username}!`);
    } else {
        // If logged out:
        res.send('Login first');
    }
});

// ------------------------------------
// Authentication Routes
// ------------------------------------

// Login Route
router.get('/login', passport.authenticate('github'), (req, res) => {});

// Logout Route
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Auth Callback Route
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false
}),
(req, res) => {
    // Save user info into the session so we know they are logged in
    req.session.user = req.user;
    res.redirect('/'); // Successful login, go back to the home page
});

// ------------------------------------
// Item Routes
// ------------------------------------

// Public Routes (Anyone can see these)
router.get('/items', controller.getAllItems);
router.post('/items', controller.createItem);
router.get('/items/:id', controller.getSingleItem);

// Protected Routes (Only logged-in users can use these)
// We added 'isAuthenticated' middleware here
router.put('/items/:id', isAuthenticated, controller.updateItem);
router.delete('/items/:id', isAuthenticated, controller.deleteItem);

// ------------------------------------
// User Routes (Second Collection)
// ------------------------------------

// Public User Routes
router.get('/users', controller.getAllUsers);
router.get('/users/:id', controller.getSingleUser);
router.post('/users', controller.createUser);

// Protected User Routes (Login Required)
router.put('/users/:id', isAuthenticated, controller.updateUser);
router.delete('/users/:id', isAuthenticated, controller.deleteUser);

module.exports = router;