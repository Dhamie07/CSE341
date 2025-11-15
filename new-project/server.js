// new-project/server.js

const express = require('express');
const app = express();
require('dotenv').config();

// Load the Swagger UI package
const swaggerUi = require('swagger-ui-express'); 
// Load the JSON documentation file directly using require()
const swaggerDocument = require('./swagger.json'); 

const db = require('./config');
const routes = require('./routes');

const PORT = process.env.PORT || 8080;

// Middleware to parse incoming JSON data (Crucial for POST requests)
app.use(express.json());

// Serve the Swagger documentation on the /api-docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Set up the routes to be accessed via the /items path
app.use('/items', routes);

// Simple root route
app.get('/', (req, res) => {
    res.send('New Project API Running!');
});

// Start the server
db.initDb((err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});