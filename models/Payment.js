const mongoose = require('mongoose');

// const paymentDetailsSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//         unique: true
//     },
//     cardNumber: {
//         type: String,
//         required: function() {
//             return !this.paypalAccount
//         }
//     },
//     securityCode: {
//         type: String,
//         required: function() {
//             return !this.paypalAccount; 
//         }
//     },
//     cardExpiration: {
//         type: Date,
//         required: function() {
//             return !this.paypalAccount; 
//         }
//     },
//     paypalAccount: {
//         type: String
//     }
// });

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true
    },
    method: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'],
        required: true
    },
    paymentDetails: [paymentDetailsSchema],
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'PHP'
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);