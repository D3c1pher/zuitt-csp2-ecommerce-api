/* ===== Dependencies and Modules ===== */
const express = require("express");

const productController = require("../controllers/product.js");
const { verify, verifyAdmin } = require("../middlewares/authentication.js");

/* ===== Routing Component ===== */
const router = express.Router();


/* ===== Product Routes ===== */
router.post("/", verify, verifyAdmin, productController.createProduct);

router.get("/all", productController.getAllProducts);

router.get("/active", productController.getAllActive);

router.get("/:productId", productController.getProduct);

router.put("/:productId", verify, verifyAdmin, productController.updateProductInfo);

router.put("/archive/:productId", verify, verifyAdmin, productController.archiveProduct);

router.put("/activate/:productId", verify, verifyAdmin, productController.activateProduct);

router.post("/searchByName", productController.searchByName);

router.post("/searchByPrice", productController.searchByPrice);

module.exports = router;