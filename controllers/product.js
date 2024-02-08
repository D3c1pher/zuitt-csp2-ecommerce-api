const Product = require("../models/Product.js");
const { createError } = require("../middlewares/error.js");


// Validation functions
const validateProductData = (name, description, price) => {
    if (!name || !description || !price || isNaN(price) || parseFloat(price) <= 0) {
        throw createError(400, "Name, description, and a valid price greater than zero are required.");
    }
};

const validatePriceRange = (minPrice, maxPrice) => {
    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
        throw createError(400, "Price range is invalid.");
    }
};


/* ===== Product Features ===== */
module.exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price } = req.body;
        validateProductData(name, description, price);

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            throw createError(400, "Product with this name already exists.");
        }
    
        const newProduct = new Product({
            name,
            description,
            price: parseFloat(price)
        });
    
        await newProduct.save();
    
        res.status(201).json({ 
            message: 'Product created successfully', 
            product: newProduct 
        });
    } catch (err) {
        console.error("Error in creating product: ", err);
        return next(err);
    }
};

module.exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});

        if(products.length > 0) {
            return res.status(200).send({ products });
        } else {
            throw createError(404, "No products found.");
        }
    } catch (err) {
        console.error("Error in finding all products: ", err);
        return next(err);
    }
};

module.exports.getAllActive = async (req, res, next) => {
    try {
        const products = await Product.find({ isActive: true });
        if (products.length > 0) {
            return res.status(200).send({ products });
        } else {
            throw createError(404, "No active products found.");
        }
    } catch (err) {
        console.error("Error in finding active products: ", err);
        return next(err);
    }
};

module.exports.getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            throw createError(404, "Product not found.");
        }

        return res.status(200).send({ product });
    } catch (err) {
        console.error("Error in finding a product: ", err);
        return next(err);
    }
};

module.exports.updateProductInfo = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const { name, description, price } = req.body;
        validateProductData(name, description, price);

        const product = await Product.findById(productId);
        if (!product) {
            throw createError(404, "Product not found.");
        }

        product.name = name;
        product.description = description;
        product.price = parseFloat(price);

        const updatedProduct = await product.save();

        return res.status(200).send({
            message: "Product updated successfully.", updatedProduct: updatedProduct
        });
    } catch (err) {
        console.error("Error in updating a product: ", err);
        return next(err);
    }
};

module.exports.archiveProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            throw createError(404, "Product not found.");
        }

        product.isActive = false;

        const archivedProduct = await product.save();

        return res.status(200).send({ 
            message: "Product archived successfully.", 
            archivedProduct: archivedProduct 
        });
    } catch (err) {
        console.error("Error in archiving a product: ", err);
        return next(err);
    }
};

module.exports.activateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            throw createError(404, "Product not found.");
        }

        product.isActive = true;

        const activatedProduct = await product.save();

        return res.status(200).send({ 
            message: "Product activated successfully.", 
            activatedProduct: activatedProduct 
        });
    } catch (err) {
        console.error("Error in activating a product: ", err);
        return next(err);
    }
};

module.exports.searchByName = async (req, res, next) => {
    try {
        const productName = req.body.name; 
        const products = await Product.find({ name: { $regex: productName, $options: 'i' } });
        if (products.length > 0) {
            return res.status(200).send({ products });
        } else {
            throw createError(404, "No products found with the given name.");
        }
    } catch (err) {
        console.error("Error in searching products by name: ", err);
        return next(err);
    }
};

module.exports.searchByPrice = async (req, res, next) => {
    try {
        const { minPrice, maxPrice } = req.body;
        validatePriceRange(parseFloat(minPrice), parseFloat(maxPrice));

        const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
        if (products.length > 0) {
            return res.status(200).send({ products });
        } else {
            throw createError(404, "No products found within the given price range.");
        }
    } catch (err) {
        console.error("Error in searching products by price range: ", err);
        return next(err);
    }
};