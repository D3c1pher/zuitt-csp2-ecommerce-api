/* ===== Dependencies and Modules ===== */
const express = require("express");

const productController = require("../controllers/product.js");
const { verify, verifyAdmin } = require("../utils/auth.js");

/* ===== Routing Component ===== */
const router = express.Router();


/* ===== Product Routes ===== */
router.post("/", verify, verifyAdmin, productController.createProduct);

router.get("/all", verify, productController.getAllProducts);

router.get("/active", verify, productController.getAllActive);

router.get("/:productId", verify, productController.getProduct);

router.put("/:productId", verify, verifyAdmin, productController.updateProductInfo);

router.put("/archive/:productId", verify, verifyAdmin, productController.archiveProduct);

router.put("/activate/:productId", verify, verifyAdmin, productController.activateProduct);


module.exports = router;