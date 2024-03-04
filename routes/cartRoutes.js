/* ===== Dependencies and Modules ===== */
const express = require("express");
const cartController = require("../controllers/cartController.js");
const { verify, verifyCustomer } = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();

/* ========== Cart Routes Start ========== */

router.get("/", verify, verifyCustomer, cartController.viewCart);

router.post("/addToCart", verify, verifyCustomer, cartController.addToCart);

router.put("/updateQuantity", verify, verifyCustomer, cartController.updateProductQuantity);

router.delete("/:productId/removeFromCart", verify, verifyCustomer, cartController.removeFromCart);

router.delete("/clearCart", verify, verifyCustomer, cartController.clearCart);

/* ========== Cart Routes End ========== */

module.exports = router;