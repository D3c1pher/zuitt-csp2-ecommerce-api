const jwt = require("jsonwebtoken");
const { createError } = require("./error.js");
const { jwtConfig } = require("../utils/config.js");


const secret = jwtConfig.secret
const expiration = jwtConfig.expiration;


module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, secret, { expiresIn: expiration });
};

module.exports.verify = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) throw createError(401, "Unauthorized Access");

	jwt.verify(token, secret, (err, decodedToken) => {
		if (err) throw createError(403, "Forbidden Access");
		req.user = decodedToken;
		next();
	});
};

module.exports.verifyAdmin = (req, res, next) => {
	if (!req.user || !req.user.isAdmin)
		throw createError(403, "Action Forbidden");
	next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.user)
		throw createError(401, "You are not logged in");
    next();
};