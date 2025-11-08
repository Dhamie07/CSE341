const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title:'Contacts API',
        description:'A simple API to manage contacts using MongoDB.'
    },
    host:'localhost:3000',
    schemes:['http', 'https']
}
const outputFile ='./swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);