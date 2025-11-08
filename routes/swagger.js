const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
// Ensure the path to swagger.json is correct relative to this file (routes/)
const swaggerDocument = require('../swagger.json');

// 1. Serve the Swagger UI static files at the root of this router (which is /api-docs)
router.use('/', swaggerUi.serve);

// 2. Set up the Swagger UI endpoint when accessing the root of this router (GET /api-docs)
router.get('/', swaggerUi.setup(swaggerDocument));

module.exports = router;