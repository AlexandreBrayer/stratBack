const mongoose = require('mongoose');

const UserModel = mongoose.Schema({
    name: {
        type: String,
        required: true
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
    }
}).set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Users', UserModel);