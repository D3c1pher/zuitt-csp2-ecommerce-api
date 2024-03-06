const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2, 
        maxlength: 100,
    },
    description: {
        type: String,
        required: true, 
        minlength: 10,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    images: [{
        type: String,
        required: false,
    }],
    price: {
        type: Number,
        required: true, 
        min: 0, 
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    // specs: {
    //     type: [String],
    //     required: false,
    // },
    // details: {
    //     type: [String],
    //     required: false,
    // },
    // compatibility: {
    //     type: [String],
    //     required: false,
    // },
    // inTheBox: {
    //     type: [String],
    //     required: false,
    // },
    isActive: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
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

productSchema.pre('save', function(next) {
    this.updatedOn = new Date();
    next();
});

// Calculate the discounted price before saving
productSchema.pre('save', function(next) {
    if (this.isModified('discount')) {
        const discountedPrice = this.price * (1 - this.discount / 100);
        this.price = discountedPrice;
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);