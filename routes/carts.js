/* ===== Dependencies and Modules ===== */
const express = require("express");

const cartController = require("../controllers/cart.js");
const { verify, verifyAdmin } = require("../utils/auth.js");

/* ===== Routing Component ===== */
const router = express.Router();


/* ===== Cart Routes ===== */
router.get("/", verify, cartController.getUserCart);

router.put("/addToCart", verify, cartController.addToCart);

router.put("/udpateQuantity", verify, cartController.changeProductQuantity);

// router.delete("/:productId/removeFromCart", verify, cartController.removeProductFromCart);

// router.delete("/clearCart", verify, cartController.clearCartItems);

// router.post("/searchByName", verify, cartController.searchByName);

// router.post("/searchByPrice", verify, cartController.searchByPrice);


module.exports = router;