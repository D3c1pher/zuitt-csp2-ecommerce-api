const jwt = require("jsonwebtoken");
const { createError } = require("./error.js");


const secret = "EcommerceAPI";

/* ===== Token Creation ===== */
module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};
	return jwt.sign(data, secret, {});
};

/* ===== Token Verification ===== */
module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if (typeof token === "undefined") {
		return next(createError(401, "Failed. No token."));
	}
	else {
		console.log(token);
		token = token.slice(7, token.length);
		console.log(token); 

        // Token decryption
		jwt.verify(token, secret, function(err, decodedToken) {
			if(err) {
				return next(createError(403, "Token is not valid."));
			}
			else {
				console.log("result from verify method: ");
				console.log(decodedToken);

				req.user = decodedToken;
				next();
			}
		});
	}
};

/* ===== Admin Verification ===== */
module.exports.verifyAdmin = (req, res, next) => {
	if(req.user.isAdmin) {
		next();
	}
	else {
		return next(createError(403, "Action Forbidden."));
	}
};

/* ===== Check if Logged in ===== */
// module.exports.isLoggedIn = (req, res, next) => {
// 	if(req.user) {
// 		next();
// 	} else {
// 		return next(createError(401, "You are not logged in."));
// 	}
// };