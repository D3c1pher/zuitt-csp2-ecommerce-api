/* ===== Dependencies and Modules ===== */
const bcrypt = require("bcrypt");

const User = require("../models/User.js");
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

        if (!validateInputs(firstName, lastName, username, email, mobileNo, password)) {
            return next(createError(400, "All fields are required."));
        }

        if (!validateEmail(email)) {
            return next(createError(400, "Email is invalid."));
        }

        if (!validateMobileNo(mobileNo)) {
            return next(createError(400, "Mobile Number is invalid."));
        }

        if (!validatePassword(password)) {
            return next(createError(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."));
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username";
            return next(createError(409, `${field} already exists.`));
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

        const registeredUser = await newUser.save();

        return res.status(201).send({
            message: "User is registered successfully.",
            registeredUser: registeredUser
        });
    } catch (err) {
        console.error("Error in user registration: ", err);
        return next(err);
    }
};

module.exports.loginUser = async (req, res, next) => {
    try {
		console.log(req.body);
        const { email, password } = req.body;

		 if (!validateEmail(email)) {
            return next(createError(400, "Email is invalid."));
        }

        const user = await User.findOne({ email });

        if (!user) {
            return next(createError(404, "User does not exist."));
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(401, "Password is invalid."));
        }

        const accessToken = auth.createAccessToken(user);
        return res.status(200).send({ 
			message: "User is logged in successfully.",
			access: accessToken 
		});
    } catch (err) {
        console.error("Error in logging in: ", err);
        return next(err);
    }
};

module.exports.getUserDetails = async (req, res, next) => {
	try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
			return next(createError(404, "User not found."));
        }

        user.password = undefined;

        return res.status(200).send({user});
    } catch (err) {
        console.error("Error in fetching user details: ", err);
        return next(err);
    }
};

module.exports.updatePassword = async (req, res) => {
	try {
		console.log(req.body);
		const { newPassword } = req.body;
        const { id } = req.user;

        if (!newPassword) {
            return next(createError(400, "New password is required."));
        }

        if (!validatePassword(newPassword)) {
            return next(createError(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."));
        }

        if (!id) {
            return next(createError(401, "Unauthorized: User ID not provided."));
        }

		const hashedPassword = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

        await User.findByIdAndUpdate(id, { password: hashedPassword });

		res.status(200).json({ message: "Password reset successfully." });
	} catch (error) {
		console.error("Error in updating password: ", err);
		return next(err);
	}
};

module.exports.updateUserToAdmin = async (req, res, next) => {
    try {
        console.log(req.params.userId);

        if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(createError(400, "Invalid user ID."));
        }

        const updateUserToAdmin = {
            isAdmin: true
        };

        const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateUserToAdmin);

        if (!updatedUser) {
            return next(createError(404, "User not found."));
        }

		res.status(200).json({ message: 'User updated to admin successfully.' });
    } catch (err) {
        console.error('Error in updating user to admin: ', err);
        return next(err);
    }
};