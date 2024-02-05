import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First Name is Required']
        },
        lastName: {
            type: String,
            required: [true, 'Last Name is Required']
        },
        email: {
            type: String,
            required: [true, 'Email is Required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password is Required']
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        mobileNo: {
            type: String,
            required: [true, 'Mobile Number is Required']
        }
    },
    { timestamps: true } // Date Added and Updated timestamp
);


module.exports = mongoose.model('User', userSchema);