const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String, 
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    expiresAt: { 
        type: Date, 
        default: Date.now, 
        index: { expires: 86400000 } 
    }
});

module.exports = mongoose.model('Token', tokenSchema);