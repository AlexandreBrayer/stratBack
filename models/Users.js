const mongoose = require('mongoose');
var sha256 = require('js-sha256');

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
        default: sha256(process.env.SECRET)
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