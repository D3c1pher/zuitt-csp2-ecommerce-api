/* ===== Dependencies and Modules ===== */
const express = require("express");
const orderController = require("../controllers/orderController.js");
const { 
    verify, 
    verifyAdmin,
    verifyCustomer
} = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();

/* ========== Order Routes Start ========== */

router.post("/checkout", verify, verifyCustomer, orderController.checkout);

router.get("/my-orders", verify, verifyCustomer, orderController.viewMyOrders);

/* ========== ========== ========== */

router.get("/all-orders", verify, verifyAdmin, orderController.viewAllOrders);

/* ========== Order Routes End ========== */

module.exports = router;
