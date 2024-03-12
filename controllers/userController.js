/* ===== Dependencies and Modules ===== */
const bcrypt = require('bcrypt');
const User = require("../models/User.js");
const auth = require("../middlewares/authentication.js");
const { errorInfo } = require("../middlewares/error.js");
const { 
    registerValidation, 
    loginValidation, 
    updateProfileValidation,
    changePasswordValidation, 
} = require("../middlewares/validations.js");

/* ========== User Controller Features Start ========== */

/* ===== Register Controller Start ===== */
module.exports.register = async (req, res, next) => {
    try {
        const { firstname, lastname, username, email, password, confirmPassword, mobileNo, address, birthdate } = req.body;

        // Capitalize the first letter of each word in the name
        const capitalizedFirstname = firstname.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        const capitalizedLastname = lastname.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

        // Validate the user input
        const validationErrors = registerValidation({ firstname, lastname, username, email, password, confirmPassword, mobileNo, address, birthdate });
        if (validationErrors.length > 0) {
            throw errorInfo(400, validationErrors);
        }
        
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username";
            throw errorInfo(409, `${field} already exists\n`);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

        // Save the user
        const newUser = new User({
            firstname: capitalizedFirstname, 
            lastname: capitalizedLastname, 
            username, 
            email, 
            password: hashedPassword, 
            mobileNo, 
            address, 
            birthdate
        });
        const user = await newUser.save();

        res.status(201).json({ user });
    } catch(err) {
        console.error("Error in user registration: ", err);
        next(err);
    }
}
/* ===== Register Controller End ===== */

/* ===== Login Controller Start ===== */
module.exports.login = async (req, res, next) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Validate the user input
        const validationErrors = loginValidation({ emailOrUsername, password });
        if (validationErrors.length > 0) {
            throw errorInfo(400, validationErrors);
        }

        // Check if the user exists with the provided email or username
        let user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
        if (!user) {
            throw errorInfo(401, "Email or username is invalid");
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw errorInfo(401, "Password is incorrect");
        }

        // Check if the user is active
        if (!user.isActive) {
            throw errorInfo(403, "Forbidden Access! Your account is not active.");
        }

        // Check if the user is blocked
        if (user.isBlocked) {
            throw errorInfo(403, "Forbidden Access! Your account has been blocked.");
        }

        const accessToken = auth.createAccessToken(user);
        res.status(200).json({ 
            message: "Login successful", 
            access: accessToken 
        });
    } catch(err) {
        console.error("Error in logging in: ", err);
        next(err);
    }
}
/* ===== Login Controller End ===== */

/* ========== ========== ========== */

/* ===== View Profile Controller Start ===== */
module.exports.viewProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            throw errorInfo(404, "User does not exist");
        }
			
        user.password = undefined;

        return res.status(200).send({ user });
    } catch(err) {
        console.error("Error in viewing profile: ", err);
        next(err);
    }
}
/* ===== View Profile Controller End ===== */

/* ===== Update Profile Controller Start ===== */
module.exports.updateProfile = async (req, res, next) => {
    try {
        const { firstname, lastname, username, email, mobileNo, address, birthdate } = req.body;

        // Validate input data
        const validationErrors = updateProfileValidation(req.body);
        if (validationErrors.length > 0) {
            throw errorInfo(400, validationErrors);
        }
        
        // Create an object to store the fields to update
        const updateFields = {};
        if (firstname) updateFields.firstname = firstname.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        if (lastname) updateFields.lastname = lastname.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (mobileNo) updateFields.mobileNo = mobileNo;
        if (address) updateFields.address = address;
        if (birthdate) updateFields.birthdate = birthdate;

        const userId = req.user.id;

        // Check if the provided email or username already exists
        const existingEmailUser = await User.findOne({ email: email, _id: { $ne: userId } });
        if (email && existingEmailUser) {
            throw errorInfo(400, "Email is already in use");
        }

        const existingUsernameUser = await User.findOne({ username: username, _id: { $ne: userId } });
        if (username && existingUsernameUser) {
            throw errorInfo(400, "Username is already taken");
        }

        // Find the user by ID and update their profile fields
        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        res.status(200).json({ 
            message: "Profile updated successfully", 
            user: updatedUser 
        });
    } catch(err) {
        console.error("Error in updating profile: ", err);
        next(err);
    }
}
/* ===== Update Profile Controller End ===== */

/* ===== Change Password Controller Start ===== */
module.exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        // Validate input data
        const validationErrors = changePasswordValidation({ currentPassword, newPassword, confirmPassword });
        if (validationErrors.length > 0) {
            throw errorInfo(400, validationErrors);
        }

        // Compare current password with hashed password
        const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordCorrect) {
            throw errorInfo(400, "Current password does not match the current password");
        }

        // Compare new password with current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword)
            throw errorInfo(400, "New password cannot be the same as the current password.");
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ 
            message: "Password changed successfully", 
            newPassword: hashedPassword
        });
    } catch(err) {
        console.error("Error in changing password: ", err);
        next(err);
    }
}
/* ===== Change Password Controller End ===== */

/* ========== ========== ========== */

/* ===== Set User to Admin Controller Start ===== */
 module.exports.setUserToAdmin = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            throw errorInfo(404, "User does not exist");
        }

        if (user.isAdmin) {
            throw errorInfo(400, "User is already admin");        
        }

        // Set user role to admin
        user.isAdmin = true;
        await user.save();

        res.status(200).json({ message: "User set to admin successfully" });
    } catch(err) {
        console.error("Error in setting user to admin: ", err);
        next(err);
    }
}
/* ===== Set User to Admin Controller End ===== */

/* ===== Set User to Customer Controller Start ===== */
module.exports.setUserToCustomer = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            throw errorInfo(404, "User does not exist");
        }
        
        if (!user.isAdmin) {
            throw errorInfo(400, "User is already customer");        
        }

        // Set user role to customer
        user.isAdmin = false;
        await user.save();

        res.status(200).json({ message: "User set to customer successfully" });
    } catch(err) {
        console.error("Error in setting user to customer: ", err);
        next(err);
    }
}
/* ===== Set User to Customer Controller End ===== */

/* ========== ========== ========== */

/* ===== Block User Controller Start ===== */
module.exports.blockUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            throw errorInfo(404, "User does not exist");
        }
        
        if (user.isBlocked) {
            throw errorInfo(400, "User is already blocked");        
        }

        // Block user
        user.isBlocked = true;
        await user.save();

        res.status(200).json({ message: "User is successfully blocked" });
    } catch(err) {
        console.error("Error in blocking user: ", err);
        next(err);
    }
}
/* ===== Block User Controller End ===== */

/* ===== Unblock User Controller Start ===== */
module.exports.unblockUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            throw errorInfo(404, "User does not exist");
        }
        
        if (!user.isBlocked) {
            throw errorInfo(400, "User is already unblocked");        
        }

        // Unblock user
        user.isBlocked = false;
        await user.save();

        res.status(200).json({ message: "User is successfully unblocked" });
    } catch(err) {
        console.error("Error in unblocking user: ", err);
        next(err);
    }
}
/* ===== Unblock User Controller End ===== */

/* ========== ========== ========== */

/* ===== Activate User Controller Start ===== */
module.exports.activateUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            throw errorInfo(404, "User does not exist");
        }
        
        if (user.isActive) {
            throw errorInfo(400, "User is already activated");        
        }

        // Activate user
        user.isActive = true;
        await user.save();

        res.status(200).json({ message: "User is successfully activated" });
    } catch(err) {
        console.error("Error in activating user: ", err);
        next(err);
    }
}
/* ===== Activate User Controller End ===== */

/* ===== Deactivate User Controller Start ===== */
module.exports.deactivateUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            throw errorInfo(404, "User does not exist");
        }
        
        if (!user.isActive) {
            throw errorInfo(400, "User is already deactivated");        
        }

        // Deactivate user
        user.isActive = false;
        await user.save();

        res.status(200).json({ message: "User is successfully deactivated" });
    } catch(err) {
        console.error("Error in deactivating user: ", err);
        next(err);
    }
}
/* ===== Deactivate User Controller End ===== */

/* ========== ========== ========== */

/* ===== View All Users Controller Start ===== */
module.exports.viewAllUsers = async (req, res, next) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        // Send the list of users as a response
        res.status(200).json({
            message: "Users retrieved successfully",
            users: users
        });
    } catch(err) {
        console.error("Error in viewing user list: ", err);
        next(err);
    }
}
/* ===== View All Users Controller End ===== */

/* ===== Search User Controller Start ===== */
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
        console.error("Error in searching users: ", err);
        return next(err);
    }
};
/* ===== Search User Controller End ===== */

/* ========== User Controller Features End ========== */