const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description must be at least 10 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be non-negative']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedOn: {
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