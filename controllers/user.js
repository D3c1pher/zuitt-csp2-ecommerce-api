/* ===== Dependencies and Modules ===== */
const bcrypt = require("bcrypt");

const User = require("../models/User.js");
const auth = require("../middlewares/authentication.js");
const { createError } = require("../middlewares/error.js");


/* ===== User Info Validations ===== */
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

const validateMobileNo = (mobileNo) => {
    const mobileRegex = /^\d{11}$/;
    return mobileRegex.test(mobileNo);
};

const validatePassword = (password) => {
    // Password must be at least 8 characters long
    if (!password || password.length < 8) {
        return false;
    }

    // Check if password contains at least one uppercase letter, one lowercase letter, one digit, and one special character
    const requirements = [
        /[A-Z]/, // Uppercase
        /[a-z]/, // Lowercase
        /\d/,    // Digit
        /[!@#$%^&*()\-_=+{};:,<.>]/ // Special character
    ];

    return requirements.every(rule => rule.test(password));
};


/* ===== User Features ===== */
module.exports.registerUser = async (req, res, next) => {
    try {
		console.log(req.body);

		const { firstName, lastName, username, email, mobileNo, password } = req.body;

		// Perform input validation
		if (!firstName || !lastName || !username || !email || !mobileNo || !password) {
			return next(createError(400, "All fields are required."));
        }

		// Validate inputs
        if (!validateEmail(email)) {
            return next(createError(400, "Email is invalid."));
        }
        if (!validateMobileNo(mobileNo)) {
            return next(createError(400, "Mobile Number is invalid."));
        }
        if (!validatePassword(password)) {
            return next(createError(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."));
        }

		// Check if email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username";
            return next(createError(409, `${field} already exists.`));
        }

		// Hash the password
        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

		// Create a new user object
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            mobileNo,
            password: hashedPassword
        });

		// Save the new user
        const registeredUser = await newUser.save();

        // Send success response
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

		// Destructure email and password from req.body
        const { email, password } = req.body;

         // Check if email is provided and valid
		 if (!validateEmail(email)) {
            return next(createError(400, "Email is invalid."));
        }

		// Find the user by email
        const user = await User.findOne({ email });

		// Check if user exists
        if (!user) {
            return next(createError(404, "User does not exist."));
        }

		// Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(401, "Password is invalid."));
        }

		// Generate and send access token
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

        // Exclude sensitive information like password
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

		// Input Validation
        if (!newPassword) {
            return next(createError(400, "New password is required."));
        }

		// Validate the new password
        if (!validatePassword(newPassword)) {
            return next(createError(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."));
        }

		// User Authentication
        if (!id) {
            return next(createError(401, "Unauthorized: User ID not provided."));
        }

		const hashedPassword = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

		// Update password
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

        // Validate user ID
        if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(createError(400, "Invalid user ID."));
        }

        // Define update object
        const updateUserToAdmin = {
            isAdmin: true
        };

        // Find user by ID and update
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateUserToAdmin);

        // Check if user exists
        if (!updatedUser) {
            return next(createError(404, "User not found."));
        }

        // Respond with success message
		res.status(200).json({ message: 'User updated to admin successfully.' });
    } catch (err) {
        console.error('Error in updating user to admin: ', err);
        return next(err);
    }
};