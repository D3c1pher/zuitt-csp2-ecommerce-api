/* ===== Dependencies and Modules ===== */
const express = require("express");
const productController = require("../controllers/productController.js");
const { 
    verify,
    verifyAdmin
} = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();

/* ========== Product Routes Start ========== */

router.post('/add-category', verify, verifyAdmin, productController.addCategory);

router.post("/", verify, verifyAdmin, productController.addProduct);

router.delete("/permanent-delete/:productId", verify, verifyAdmin, productController.deleteProduct);

router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

/* ========== ========== ========== */

router.get("/all", verify, verifyAdmin, productController.viewAllProducts);

router.get("/active", productController.viewAvailableProducts);

router.get("/:productId", productController.viewProduct);

/* ========== ========== ========== */

router.put("/archive/:productId", verify, verifyAdmin, productController.archiveProduct);

router.put("/activate/:productId", verify, verifyAdmin, productController.activateProduct);

// /* ========== ========== ========== */

router.post("/searchByName", productController.searchByName);

router.post("/searchByPrice", productController.searchByPrice);

/* ========== Product Routes End ========== */

module.exports = router;