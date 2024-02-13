/* ===== Dependencies and Modules ===== */
const express = require("express");
const cartController = require("../controllers/cart.js");
const { verify, verifyCustomer } = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();


/* ===== Cart Routes ===== */
// View User Cart
router.get("/", verify, verifyCustomer, cartController.getUserCart);

// User's Cart Functionality
router.put("/addToCart", verify, verifyCustomer, cartController.addToCart);

router.put("/updateQuantity", verify, verifyCustomer, cartController.updateProductQuantity);

router.delete("/:productId/removeFromCart", verify, verifyCustomer, cartController.removeProductFromCart);

router.delete("/clearCart", verify, verifyCustomer, cartController.clearCartItems);


module.exports = router;