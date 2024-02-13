/* ===== Dependencies and Modules ===== */
const express = require("express");
const productController = require("../controllers/product.js");
const { 
    verify,
    verifyAdmin 
} = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();


/* ===== Product Routes ===== */
// Create Product
router.post("/", verify, verifyAdmin, productController.createProduct);


// View Products
router.get("/all", productController.getAllProducts);

router.get("/active", productController.getAllActive);

router.get("/:productId", productController.getProduct);


// Update Product Info
router.put("/:productId", verify, verifyAdmin, productController.updateProductInfo);

router.put("/archive/:productId", verify, verifyAdmin, productController.archiveProduct);

router.put("/activate/:productId", verify, verifyAdmin, productController.activateProduct);


// Search functionalities
router.post("/searchByName", productController.searchByName);

router.post("/searchByPrice", productController.searchByPrice);


module.exports = router;