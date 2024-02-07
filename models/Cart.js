const mongoose = require('mongoose');


const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Product ID is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity must be non-negative"]
    },
    subtotal: {
        type: Number,
        required: true,
        min: [0, "Subtotal must be non-negative"]
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        index: true
    },
    cartItems: [cartItemSchema],
    totalPrice: {
        type: Number,
        default: 0,
        min: [0, "Price must be non-negative"]
    },
    orderedOn: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Cart', cartSchema);