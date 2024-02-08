/* ===== Dependencies and Modules ===== */
const express = require("express");
const passport = require("passport");

const userController = require("../controllers/user.js");
const { 
    verify, 
    verifyAdmin, 
    isLoggedIn 
} = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();


/* ===== User Routes ===== */
router.post("/", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/details", verify, userController.getUserDetails);

router.put('/update-password', verify, userController.updatePassword);

router.put('/:userId/set-as-admin', verify, verifyAdmin, userController.updateUserToAdmin);


/* ===== Google Login ===== */
// router.get("/google", 
// 	passport.authenticate("google", {
// 		scope: ["email", "profile"],
// 		prompt: "select_account"
// 	}
// ));

// router.get("/google/callback",
// 	passport.authenticate("google", {
// 		failureRedirect: "/users/failed"	
// 	}),
// 	function(req, res){
// 		res.redirect("/users/success");
// 	}
// );

// router.get("/failed", (req,res) => {
// 	console.log("User is not authenticated");
// 	res.send("Failed");
// });

// router.get("/success", isLoggedIn, (req,res) => {
// 	console.log("You are logged in");
// 	console.log(req.user);
// 	res.send(`Welcome ${req.user.displayName}`);
// });

// router.get("/logout", (req, res) => {
// 	req.session.destroy((err) => {
// 		if(err){
// 			console.error("Error while destroying session:", err)
// 		} else {
// 			req.logout(() => {
// 				// Redirects the page to "http://localhost:4000" route to visual redirection in frontend.
// 				console.log("You are logged out");
// 				res.redirect("/");
// 			})
// 		}
// 	})
// });


module.exports = router;