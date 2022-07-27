const mongoose = require('mongoose');

const UserModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    token: {
        type: String,
    },
    silver: {
        type: Boolean,
        default: false
    },
    unbanned: {
        type: Number,
    }
}).set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Users', UserModel);