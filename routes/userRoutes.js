/* ===== Dependencies and Modules ===== */
const express = require("express");
const userController = require("../controllers/userController.js");
const { verify, verifyAdmin } = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();

/* ========== User Routes Start ========== */

router.post('/', userController.register);

router.post('/login', userController.login);

/* ========== ========== ========== */

router.get('/details', verify, userController.viewProfile);

router.put('/details', verify, userController.updateProfile);

// STRETCH GOAL:
// router.put('/profile/change-picture', verify, userController.changeProfilePicture);

router.put('/update-password', verify, userController.changePassword);

// STRETCH GOAL:
// router.put('/reset-password', userController.resetPassword);

/* ========== ========== ========== */

router.put('/:userId/set-as-admin', verify, verifyAdmin, userController.setUserToAdmin);

router.put('/:userId/set-as-customer', verify, verifyAdmin, userController.setUserToCustomer);

/* ========== ========== ========== */

router.put('/:userId/block-user', verify, verifyAdmin, userController.blockUser);

router.put('/:userId/unblock-user', verify, verifyAdmin, userController.unblockUser);

/* ========== ========== ========== */

router.put('/:userId/activate-user', verify, verifyAdmin, userController.activateUser);

router.put('/:userId/deactivate-user', verify, verifyAdmin, userController.deactivateUser);

/* ========== ========== ========== */

router.get('/view-all-users', verify, verifyAdmin, userController.viewAllUsers);

router.post('/search-users', verify, verifyAdmin, userController.searchUsers);

/* ========== User Routes End ========== */

module.exports = router;
