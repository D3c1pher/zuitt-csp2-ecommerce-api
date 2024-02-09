/* ===== Dependencies and Modules ===== */
/* ===== Models ===== */
const Product = require("../models/Product.js");
/* ===== Middlewares ===== */
const { createError } = require("../middlewares/error.js");
/* ===== Helpers ===== */
const { formatMoney } = require("../helpers/priceFormatting.js");
/* ===== Validations ===== */
const {
    validateInputs,
    validatePriceRange
} = require("../middlewares/validations.js");


/* ===== Product Features ===== */
module.exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price } = req.body;
        if (!validateInputs(name, description, price) || isNaN(price) || parseFloat(price) <= 0)
            throw createError(400, "Name, description, and a valid price greater than zero are required");

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) throw createError(400, "Product with this name already exists");

        const formattedPrice = formatMoney(parseFloat(price));
    
        const newProduct = new Product({
            name,
            description,
            price: parseFloat(price)
        });
    
        await newProduct.save();

        const formattedProduct = {
            ...newProduct.toObject(),
            price: formattedPrice
        };
    
        res.status(201).json({ 
            message: "Product created successfully", 
            product: formattedProduct
        });
    } catch (err) {
        console.error("Error in creating product: ", err);
        return next(err);
    }
};

module.exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});

        if(!products.length > 0)
            throw createError(404, "No products found");

        const formattedProducts = products.map(product => ({
            ...product.toObject(),
            price: formatMoney(product.price)
        }));

        return res.status(200).send({ products: formattedProducts });
    } catch (err) {
        console.error("Error in finding all products: ", err);
        return next(err);
    }
};

module.exports.getAllActive = async (req, res, next) => {
    try {
        const products = await Product.find({ isActive: true });

        if(!products.length > 0)
            throw createError(404, "No active products found");

        const formattedProducts = products.map(product => ({
            ...product.toObject(),
            price: formatMoney(product.price)
        }));

        return res.status(200).send({ products: formattedProducts });
    } catch (err) {
        console.error("Error in finding active products: ", err);
        return next(err);
    }
};

module.exports.getProduct = async (req, res, next) => {
    try {
        if (!req.params.productId.match(/^[0-9a-fA-F]{24}$/))
            throw createError(400, "Invalid product ID");

        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) throw createError(404, "Product does not exist");

        const formattedPrice = formatMoney(product.price);
        const formattedProduct = {
            ...product.toObject(),
            price: formattedPrice
        };

        return res.status(200).send({ product: formattedProduct });
    } catch (err) {
        console.error("Error in finding a product: ", err);
        return next(err);
    }
};

module.exports.updateProductInfo = async (req, res, next) => {
    try {
        if (!req.params.productId.match(/^[0-9a-fA-F]{24}$/))
            throw createError(400, "Invalid product ID");

        const productId = req.params.productId;

        const { name, description, price } = req.body;
        if (!validateInputs(name, description, price) || isNaN(price) || parseFloat(price) <= 0)
            throw createError(400, "Name, description, and a valid price greater than zero are required");

        const product = await Product.findById(productId);
        if (!product) throw createError(404, "Product does not exist");

        product.name = name;
        product.description = description;
        product.price = parseFloat(price);

        const updatedProduct = await product.save();

        const formattedPrice = formatMoney(updatedProduct.price);
        const formattedProduct = {
            ...product.toObject(),
            price: formattedPrice
        };

        return res.status(200).send({
            message: "Product updated successfully",
            updatedProduct: formattedProduct
        });
    } catch (err) {
        console.error("Error in updating a product: ", err);
        return next(err);
    }
};

module.exports.archiveProduct = async (req, res, next) => {
    try {
        if (!req.params.productId.match(/^[0-9a-fA-F]{24}$/))
            throw createError(400, "Invalid product ID");

        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) throw createError(404, "Product does not exist");

        product.isActive = false;

        const archivedProduct = await product.save();

        const formattedPrice = formatMoney(archivedProduct.price);
        const formattedProduct = {
            ...product.toObject(),
            price: formattedPrice
        };

        return res.status(200).send({ 
            message: "Product archived successfully", 
            archivedProduct: formattedProduct
        });
    } catch (err) {
        console.error("Error in archiving a product: ", err);
        return next(err);
    }
};

module.exports.activateProduct = async (req, res, next) => {
    try {
        if (!req.params.productId.match(/^[0-9a-fA-F]{24}$/))
            throw createError(400, "Invalid product ID");

        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) throw createError(404, "Product does not exist");

        product.isActive = true;

        const activatedProduct = await product.save();

        const formattedPrice = formatMoney(activatedProduct.price);
        const formattedProduct = {
            ...product.toObject(),
            price: formattedPrice
        };

        return res.status(200).send({ 
            message: "Product activated successfully", 
            activatedProduct: formattedProduct 
        });
    } catch (err) {
        console.error("Error in activating a product: ", err);
        return next(err);
    }
};

module.exports.searchByName = async (req, res, next) => {
    try {
        const productName = req.body.name; 
        if (!productName) throw createError(400, "No product name provided");

        const products = await Product.find({ name: { $regex: productName, $options: 'i' } });
        if (!products.length > 0)
            throw createError(404, "No products found with the given name");

        const formattedProducts = products.map(products => ({
            ...products.toObject(),
            price: formatMoney(products.price)
        }));

        return res.status(200).send({ products: formattedProducts });
    } catch (err) {
        console.error("Error in searching products by name: ", err);
        return next(err);
    }
};

module.exports.searchByPrice = async (req, res, next) => {
    try {
        const { minPrice, maxPrice } = req.body;
        if (!validateInputs(minPrice, maxPrice))
            throw createError(400, "Price range is missing");

        if (!validatePriceRange(minPrice, maxPrice))
            throw createError(400, "Price range is invalid");

        const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });

        if (!products.length > 0)
            throw createError(404, "No products found within the given price range");

        const formattedProducts = products.map(products => ({
            ...products.toObject(),
            price: formatMoney(products.price)
        }));

        return res.status(200).send({ products: formattedProducts });
    } catch (err) {
        console.error("Error in searching products by price range: ", err);
        return next(err);
    }
};