/* ===== Dependencies and Modules ===== */
const jwt = require("jsonwebtoken");
const { errorInfo } = require("./error.js");
const { jwtConfig } = require("../utils/config.js");

const secret = jwtConfig.secret;
const expiration = jwtConfig.expiration;

/* ===== Create JsonWebToken ===== */
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, secret, { expiresIn: expiration });
};

/* ===== Authentication ===== */
module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization?.split(" ")[1];

	if (!token && req.cookies) {
        token = req.cookies.accessToken;
    }

	if (!token) 
		throw errorInfo(401, "Unauthorized Access!");

	jwt.verify(token, secret, (err, decodedToken) => {

		if (err) {
			throw errorInfo(403, "Forbidden Access!");
		}

		req.user = decodedToken;
		next();
	});
};

module.exports.verifyAdmin = (req, res, next) => {
	if (!req.user || !req.user.isAdmin)
		throw errorInfo(403, "Forbidden Action!");
	next();
};

module.exports.verifyCustomer = (req, res, next) => {
	if (!req.user || req.user.isAdmin)
		throw errorInfo(403, "Forbidden Action!");
	next();
};