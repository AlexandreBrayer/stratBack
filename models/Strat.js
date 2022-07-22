const mongoose = require('mongoose');
const { ObjectId } = require('bson');

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
    vars: {
        type: Object,
        default: {}
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
    upVoters: [{
        type: ObjectId,
        ref: 'User'
    }],
    downVoters: [{
        type: ObjectId,
        ref: 'User'
    }],
    side: {
        type: String,
        default: 'none',
        required: true
    }
}).set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Strats', StratModel);