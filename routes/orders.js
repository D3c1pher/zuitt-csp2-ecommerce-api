/* ===== Dependencies and Modules ===== */
const express = require("express");
const orderController = require("../controllers/order.js");
const { 
    verify, 
    verifyAdmin,
    verifyCustomer
} = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();


/* ===== Order Routes ===== */
// Checkout Order
router.post("/checkout", verify, verifyCustomer, orderController.checkoutOrder);

// View User Order History
router.get("/my-orders", verify, verifyCustomer, orderController.getMyOrders);

// View All Orders
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);


module.exports = router;