const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minLength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guest'],
        default: 'user'
    },
    githubId: {
        type: String,
        // This is useful if you eventually want to link this to your OAuth login
        default: null
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);