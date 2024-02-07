const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        index: true
    },
    productsOrdered: [{
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
            required: [true, "Subtotal is required"],
            min: [0, "Subtotal must be non-negative"]
        }
    }],
    totalPrice: {
        type: Number,
        required: [true, "Total Price is required"]
    },
    orderedOn: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pending'
    }
});


module.exports = mongoose.model('Order', orderSchema);