const Product = require("../models/Product");
const { createError } = require("../utils/error.js");


/* ===== Product Features ===== */
module.exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price } = req.body;

        // Validate product data
        if (!name || !description || !price) {
            return next(createError(400, "Name, description, and price are required."));
        }

        // Check if product with same name already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return next(createError(400, "Product with this name already exists."));
        }
    
        // Create a new product instance
        const newProduct = new Product({
            name,
            description,
            price
        });
    
        // Save the product to the database
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
            return next(createError(404, "No products found."));
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
            return next(createError(404, "No active products found."));
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
            return next(createError(404, "Product not found."));
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
        
        let updatedProduct = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        }

        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });

        if (!product) {
            return next(createError(404, "Product not found."));
        }

        return res.status(200).send({
            message: "Product updated successfully", updatedProduct: product
        });
    } catch (err) {
        console.error("Error in updating a product: ", err);
        return next(err);
    }
};

module.exports.archiveProduct = async (req, res, next) => {
    try {
        let updateActiveField = {
            isActive: false
        };
        
        const archivedProduct = await Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true });

        if (!archivedProduct) {
            return next(createError(404, "Product not found."));
        }
        
        return res.status(200).send({ 
            message: 'Product archived successfully.', 
            archivedProduct: archivedProduct 
        });
    } catch (err) {
        console.error("Error in archiving a product: ", err);
        return next(err);
    }
};

module.exports.activateProduct = async (req, res, next) => {
    try {
        let updateActiveField = {
            isActive: true
        };
        
        const activatedProduct = await Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true });

        if (!activatedProduct) {
            return next(createError(404, "Product not found."));
        }
        
        return res.status(200).send({ 
            message: 'Product activated successfully.', 
            activatedProduct: activatedProduct 
        });
    } catch (err) {
        console.error("Error in activating a product: ", err);

        return next(err);
    }
};