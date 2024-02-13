/* ===== Dependencies and Modules ===== */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require("../models/User.js");
const Token = require("../models/Token.js");
const auth = require("../middlewares/authentication.js");
const { createError } = require("../middlewares/error.js");
const {
    validateInputs,
    validateEmail,
    validateMobileNo,
    validatePassword
} = require("../middlewares/validations.js");


/* ===== User Features ===== */
module.exports.registerUser = async (req, res, next) => {
    try {
        console.log(req.body);
        const { firstName, lastName, username, email, mobileNo, password } = req.body;

        if (!validateInputs(firstName, lastName, username, email, mobileNo, password))
            throw createError(400, "All fields are required!");

        if (!validateEmail(email))
            throw createError(400, "Email is invalid!");

        if (!validateMobileNo(mobileNo))
            throw createError(400, "Mobile Number is invalid!");

        if (!validatePassword(password))
            throw createError(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username";
            throw createError(409, `${field} already exists!`);
        }

        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            mobileNo,
            password: hashedPassword
        });
        await newUser.save();

        const token = new Token({ 
            userId: newUser._id, 
            token: crypto.randomBytes(16).toString('hex') 
        });
        await token.save();
        
        const mailOptions = {
            from: 'no-reply@example.com',
            to: newUser.email,
            subject: 'Account Verification Link',
            text: `Hello ${req.body.firstName}, Please verify your account by clicking the link: http://${req.headers.host}/users/confirmation/${newUser.email}/${token.token} Thank You!`
        };

        return res.status(200).send({
            message: `A verification email has been sent to ${newUser.email}. It will expire after one day. If you don't receive the verification email, click on resend token.`,
            mail: mailOptions
        });
    } catch (err) {
        console.error("Error in user registration: ", err);
        return next(err);
    }
};

module.exports.confirmEmail = async (req, res, next) => {
    try {
        const token = await Token.findOne({ token: req.params.token });
        
        if (!token)
            throw createError(400, "Your verification link may have expired. Please click on resend to verify your Email.");

        const user = await User.findOne({ _id: token.userId, email: req.params.email });

        if (!user)
            throw createError(401, "We were unable to find a user for this verification. Please sign up!");

        if (user.isVerified)
            return res.status(200).send({message: "User has already been verified. Please login."});

        user.isVerified = true;
        await user.save();

        await Token.findByIdAndDelete(token._id);

        const registeredUser = await User.findOne({ email: req.params.email });

        return res.status(200).send({
            message: "Your account has been successfully verified.",
            registeredUser: registeredUser
    });
    } catch (err) {
        console.error("Error in email confirmation: ", err);
        return next(err);
    }
};

module.exports.resendLink = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user)
            throw createError(401, "We were unable to find a user with that email. Make sure your Email is correct!");

        if (user.isVerified)
            return res.status(200).send('This account has been already verified. Please log in.');

        const token = new Token({ userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        await token.save();

        const mailOptions = {
            from: 'no-reply@example.com',
            to: user.email,
            subject: 'Account Verification Link',
            text: `Hello ${user.firstName}, Please verify your account by clicking the link: http://${req.headers.host}/users/confirmation/${user.email}/${token.token} Thank You!`
        };

        return res.status(200).send({
            message: `A verification email has been sent to ${user.email}. It will expire after one day. If you don't receive the verification email, click on resend token.`,
            mail: mailOptions
        });
    } catch (err) {
        console.error("Error in resending verification link: ", err);
        next(err);
    }
};

/* ========== ========== */

module.exports.loginUser = async (req, res, next) => {
    try {
        if (req.session.userId) {
            req.session.destroy();
        }

        const { email, password } = req.body;

        if (!validateInputs(email, password))
            throw createError(400, "Input your email and password!");

		if (!validateEmail(email))
            throw createError(400, "Email is invalid!");

        const user = await User.findOne({ email });

        if (!user) 
            throw createError(404, `The email address ${req.body.email} is not associated with any account. Please check and try again.`);

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect)
            throw createError(401, "Password is incorrect!");

        if (!user.isVerified)
            throw createError(401, "Your account has not been verified. Please click on resend to verify your Email.");

        req.session.userId = user._id;

        const accessToken = auth.createAccessToken(user);
        return res.status(200).send({ 
			message: "User is logged in successfully",
			access: accessToken
		});
    } catch (err) {
        console.error("Error in logging in: ", err);
        return next(err);
    }
};

module.exports.logoutUser = async (req, res, next) => {
    try {
        req.session.destroy();

        return res.status(200).json({ message: "User logged out successfully." });
    } catch (err) {
        console.error("Error in logging out: ", err);
        return next(err);
    }
};

/* ========== ========== */

module.exports.getUserDetails = async (req, res, next) => {
	try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user)
			throw createError(404, "User does not exist.");

        user.password = undefined;

        return res.status(200).send({ user });
    } catch (err) {
        console.error("Error in fetching user details: ", err);
        return next(err);
    }
};

module.exports.updateUserProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, username, email, mobileNo } = req.body;
        const userId = req.user.id;

        if (!validateInputs(firstName, lastName, username, email, mobileNo))
            throw createError(400, "All fields are required!");

        if (!validateEmail(email))
            throw createError(400, "Email is invalid!");

        if (!validateMobileNo(mobileNo))
            throw createError(400, "Mobile Number is invalid!");

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username";
            throw createError(409, `${field} already exists!`);
        }
        
        const updatedFields = {
            firstName,
            lastName,
            username,
            email,
            mobileNo
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        if (!updatedUser)
            throw createError(404, "User does not exist.");

        return res.status(200).send({
            message: "User profile updated successfully.",
            updatedUser: updatedUser 
        });
    } catch (err) {
        console.error("Error in updating user profile: ", err);
        return next(err);
    }
};

/* ========== ========== */

module.exports.updatePassword = async (req, res, next) => {
	try {
        const { newPassword, confirmPassword } = req.body;
        const { id } = req.user;

        if (!validateInputs(newPassword, confirmPassword))
            throw createError(400, "New password and confirm password are required.");

        if (newPassword !== confirmPassword)
            throw createError(400, "New password and confirm password must match.");

        if (!validatePassword(newPassword))
            throw createError(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");

        const user = await User.findById(id);

        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        if (isSamePassword)
            throw createError(400, "New password cannot be the same as the old password.");

        await Token.deleteMany({ userId: id });

        const token = new Token({ userId: id, token: crypto.randomBytes(16).toString('hex') });
        await token.save();

        const hashedNewPassword = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

        await User.findByIdAndUpdate(id, { 
            newPassword: hashedNewPassword, 
            passwordResetToken: token.token });

        const mailOptions = {
            from: 'no-reply@example.com',
            to: req.user.email,
            subject: 'Password Change Confirmation Link',
            text: `Hello ${req.user.firstName}, Please confirm password change by clicking the link: http://${req.headers.host}/users/confirm-password-change/${token.token} Thank You!`
        };

        return res.status(200).send({
            message: `Password reset request received. A confirmation email has been sent to ${req.user.email}. It will expire after one day. If you didn't receive a confirmation email, click on resend token.`,
            mail: mailOptions
        });
	} catch (err) {
		console.error("Error in updating password: ", err);
		return next(err);
	}
};

module.exports.confirmPasswordChange = async (req, res, next) => {
    try {
        const token = await Token.findOne({ token: req.params.token });
        
        if (!token)
            throw createError(400, "Your confirmation link may have expired. Please click on resend to confirm password change.");

        const user = await User.findById(token.userId);

        if (!user)
            throw createError(400, "Invalid or expired token.");

        user.password = user.newPassword;
        user.newPassword = undefined;
        user.passwordResetToken = undefined;
        await user.save();

        await Token.findByIdAndDelete(token._id);

        res.status(200).send({ message: "Password changed successfully." });
    } catch (err) {
        console.error("Error in confirming password change: ", err);
        next(err);
    }
};

module.exports.resendPasswordChange = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user)
            throw createError(401, "We were unable to find a user with that email. Make sure your Email is correct!");

        await Token.deleteMany({ userId: user.id });

        const token = new Token({ userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        await token.save();

        const mailOptions = {
            from: 'no-reply@example.com',
            to: user.email,
            subject: 'Password Change Confirmation Link',
            text: `Hello ${user.firstName}, Please confirm password change by clicking the link: http://${req.headers.host}/users/confirm-password-change/${token.token} Thank You!`
        };

        return res.status(200).send({
            message: `Password reset request received. A confirmation email has been sent to ${req.user.email}. It will expire after one day. If you didn't receive a confirmation email, click on resend token.`,
            mail: mailOptions
        });
    } catch (err) {
        console.error("Error in resending password change link: ", err);
        next(err);
    }
};

/* ========== ========== */

module.exports.updateUserToAdmin = async (req, res, next) => {
    try {
        if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/))
            throw createError(400, "Invalid user ID!");

        const updateUserToAdmin = {
            isAdmin: true
        };
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateUserToAdmin);

        if (!updatedUser)
            throw createError(404, "User does not exist.");

		res.status(200).json({ message: "User updated to admin successfully." });
    } catch (err) {
        console.error("Error in updating user to admin: ", err);
        return next(err);
    }
};

/* ========== ========== */

module.exports.searchUsers = async (req, res, next) => {
    try {
        const { searchTerm } = req.body;
        const users = await User.find(
            {
                $or: [
                    { firstName: { $regex: searchTerm, $options: 'i' } }, 
                    { lastName: { $regex: searchTerm, $options: 'i' } },  
                    { email: { $regex: searchTerm, $options: 'i' } },  
                ]
            },
            { password: 0 }
        );
        
        return res.status(200).send({ userSearchResults: users });
    } catch (err) {
        console.error("Error in user search: ", err);
        return next(err);
    }
};