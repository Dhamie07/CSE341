const mongoose = require('mongoose');
require('dotenv').config();

let _db;

const initDb = (callback) => {
    if (_db) {
        return callback(null, _db);
    }
    mongoose.connect(process.env.MONGODB_URI)
        .then((client) => {
            _db = client;
            console.log('Database connected successfully!');
            callback(null, _db);
        })
        .catch((err) => {
            callback(err);
        });
};

module.exports = { initDb };