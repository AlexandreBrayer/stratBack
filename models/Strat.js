const mongoose = require('mongoose');

const StratModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    }
}).set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Strats', StratModel);