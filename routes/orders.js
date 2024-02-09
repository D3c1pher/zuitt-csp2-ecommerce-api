/* ===== Dependencies and Modules ===== */
const express = require("express");
const orderController = require("../controllers/order.js");
const { 
    verify, 
    verifyAdmin
} = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();


/* ===== Order Routes ===== */
router.post("/checkout", verify, orderController.checkoutOrder);

router.get("/my-orders", verify, orderController.getMyOrders);

router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);


module.exports = router;