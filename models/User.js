const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First Name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last Name is required'],
            trim: true
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [20, 'Username cannot be longer than 20 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        mobileNo: {
            type: String,
            required: [true, 'Mobile Number is required']
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);