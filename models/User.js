const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true, 
            trim: true,
        },
        lastname: {
            type: String,
            required: true, 
            trim: true,
        },
        username: {
            type: String,
            required: true, 
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 20, 
        },
        email: {
            type: String,
            required: true, 
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobileNo: {
            type: String,
            required: true, 
        },
        address: {
            type: String,
            required: true,
        },
        birthdate: {
            type: Date,
            required: true, 
        },
        profileImage: {
            type: String,
        },
        isBlocked: {
            type: Boolean, 
            default: false, 
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean, 
            default: true, 
        },
        // newPassword: {
        //     type: String,
        // },
        // passwordResetToken: {
        //     type: String,
        // },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);