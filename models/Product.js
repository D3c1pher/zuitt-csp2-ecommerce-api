const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


// Add virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
    return `₱ ${this.price.toFixed(2)}`;
});

// Add pre-save hook for updating updatedAt
productSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});


module.exports = mongoose.model('Product', productSchema);