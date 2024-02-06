const mongoose = require('mongoose');


const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Product ID is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"]
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID is required"]
    },
    cartItems: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: [true, "Total Price is required"]
    },
    orderedOn: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Cart', cartSchema);