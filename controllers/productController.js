/* ===== Dependencies and Modules ===== */
const Product = require("../models/Product.js");
const Category = require("../models/Category.js");
const { errorInfo } = require("../middlewares/error.js");

/* ========== Product Controller Features Start ========== */

/* ===== Create Product Category Controller Start ===== */
module.exports.createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name){
            throw errorInfo(400, "Category name is required");
        }

        // Check if category with this name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            throw errorInfo(400, "Category with this name already exists");
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json({ 
            message: 'Category created successfully.', 
            category: newCategory 
        });
    } catch (err) {
        console.error("Error in creating category: ", err);
        next(err);
    }
};
/* ===== Create Product Category Controller End ===== */

/* ===== Add Product Controller Start ===== */
module.exports.addProduct = async (req, res, next) => {
    try {
        const { name, description, price, category } = req.body;

        // Basic input validations
        if (!name || !description || !price || !category) {
            throw errorInfo(400, "Name, description, price, and category are required");
        }
        
        if (typeof price !== 'number' || price <= 0) {
            throw errorInfo(400, "Price must be a positive number");
        }

        // Check if the category exists
        const categoryObject = await Category.findOne({ name: category });
        if (!categoryObject) {
            throw errorInfo(400, "Category is invalid");
        }

        // Check if the product already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            throw errorInfo(400, "Product with the same name already exists");
        }

        // Create the product
        const productData = { name, description, price, category: categoryObject._id };
        if (req.body.specs) productData.specs = req.body.specs;
        if (req.body.details) productData.details = req.body.details;
        if (req.body.compatibility) productData.compatibility = req.body.compatibility;
        if (req.body.inTheBox) productData.inTheBox = req.body.inTheBox;
        if (req.body.images) productData.images = req.body.images;
        if (req.body.discount) productData.discount = req.body.discount;

        // Save the product
        const product = new Product(productData);
        await product.save();

        // Assign the product to the specified category
        categoryObject.products.push(product);
        await categoryObject.save();

        res.status(201).json({ 
            message: "Product added successfully", 
            product 
        });
    } catch (err) {
        console.error("Error in adding product: ", err);
        next(err);
    }
};
/* ===== Add Product Controller End ===== */

/* ===== Delete Product Controller Start ===== */
module.exports.deleteProduct = async (req, res, next) => {
    try{
        const productId = req.params.productId;

        // Find the product and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            throw errorInfo(404, "Product does not exist");
        }

        // Remove the product from categories
        await Category.updateMany(
            { products: productId },
            { $pull: { products: productId } }
        );

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Error in deleting product: ", err);
        next(err);
    }
}
/* ===== Delete Product Controller End ===== */

/* ===== Update Product Controller Start ===== */
module.exports.updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        // Get the updated product data from the request body
        const productData = req.body;

        // Retrieve the existing product
        const product = await Product.findById(productId);
        if (!product) {
            throw errorInfo(404, "Product not found");
        }

        // Create an object to hold only the updated fields
        const updatedFields = {};

        // Check if the name is provided and changed
        if (productData.name && productData.name !== product.name) {
            // Check if the new name already exists in the database
            const existingProduct = await Product.findOne({ name: productData.name });
            if (existingProduct) {
                throw errorInfo(400, "Product with this name already exists");
            }
            updatedFields.name = productData.name;
        }

        // Check each field in the request body and add it to updatedFields if provided
        if (productData.description) updatedFields.description = productData.description;
        if (productData.price) updatedFields.price = productData.price;
        if (productData.category) updatedFields.category = productData.category;
        if (Array.isArray(productData.specs)) updatedFields.specs = productData.specs;
        if (Array.isArray(productData.details)) updatedFields.details = productData.details;
        if (Array.isArray(productData.compatibility)) updatedFields.compatibility = productData.compatibility;
        if (Array.isArray(productData.inTheBox)) updatedFields.inTheBox = productData.inTheBox;
        if (Array.isArray(productData.images)) updatedFields.images = productData.images;
        if (productData.discount) updatedFields.discount = productData.discount;

        // Check if the price is provided and valid
        if (updatedFields.price && (typeof updatedFields.price !== 'number' || updatedFields.price <= 0)) {
            throw errorInfo(400, "Price must be a positive number");
        }

        // Check if the category exists and assign its ObjectId to updatedFields.category
        if (updatedFields.category) {
            const category = await Category.findOne({ name: updatedFields.category });
            if (!category) {
                throw errorInfo(400, "Category is invalid");
            }
            updatedFields.category = category._id;
        }

        // Set updatedOn field to the current date and time
        updatedFields.updatedOn = new Date();

        // Update the product using $set to only update the specified fields
        const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: updatedFields }, { new: true });
        if (!updatedProduct) {
            throw errorInfo(404, "Product does not exist");
        }

        res.status(200).json({ 
            message: "Product updated successfully", 
            product: updatedProduct 
        });
    } catch (err) {
        console.error("Error in updating product: ", err);
        next(err);
    }
};
/* ===== Update Product Controller End ===== */

/* ========== ========== ========== */

/* ===== View All Product Controller Start ===== */
module.exports.viewAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            return res.status(200).json({ message: "No products found" });
        }

        res.status(200).json({ products });
    } catch (err) {
        console.error("Error in viewing all products: ", err);
        next(err);
    }
};
/* ===== View All Product Controller End ===== */

/* ===== View Available Product Controller Start ===== */
module.exports.viewAvailableProducts = async (req, res, next) => {
    try{
        const products = await Product.find({ isActive: true });

        if (products.length === 0) {
            return res.status(200).json({ message: "No available products found" });
        }
        
        res.status(200).json({ products });
    } catch (err) {
        console.error("Error in viewing available products: ", err);
        next(err);
    }
}
/* ===== View Available Product Controller End ===== */

/* ===== View Product Controller Start ===== */
module.exports.viewProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            throw errorInfo(404, "Product not found");
        }

        const isAdmin = req.user && req.user.isAdmin;
        const isActiveProduct = product.isActive;

        // Check if the user is an admin or if the product is active
        if (isAdmin || (isActiveProduct && !req.user)) {
            // Admin can view any product or customer can view active products
            res.status(200).json({ product });
        } else {
            throw errorInfo(404, "Product not found or inactive");
        }
    } catch (err) {
        console.error("Error in viewing product: ", err);
        next(err);
    }
}
/* ===== View Product Controller End ===== */

/* ========== ========== ========== */

/* ===== Archive Product Controller Start ===== */
module.exports.archiveProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        
        // Check if the product exists
        const product = await Product.findById(productId);
        
        if (!product) {
            throw errorInfo(404, "Product not found");
        }

        if (!product.isActive) {
            throw errorInfo(400, "Product is already archived");
        }
        
        // Update product isActive to false
        product.isActive = false;
        await product.save();
        
        res.status(200).json({ message: "Product archived successfully" });
    } catch (err) {
        console.error("Error in archiving product: ", err);
        next(err);
    }
}
/* ===== Archive Product Controller End ===== */

/* ===== Activate Product Controller Start ===== */
module.exports.activateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        
        // Check if the product exists
        const product = await Product.findById(productId);
        
        if (!product) {
            throw errorInfo(404, "Product not found");
        }

        if (product.isActive) {
            throw errorInfo(400, "Product is already activated");
        }
        
        // Update product isActive to true
        product.isActive = true;
        await product.save();
        
        res.status(200).json({ message: "Product activated successfully" });
    } catch (err) {
        console.error("Error in archiving product: ", err);
        next(err);
    }
}
/* ===== Activate Product Controller End ===== */

/* ========== ========== ========== */

/* ===== Search By Name Product Controller Start ===== */
module.exports.searchByName = async (req, res, next) => {
    try {
        const productName = req.body.name; 

        if (!productName) {
            throw errorInfo(400, "No product name provided");
        } 

        let query = { name: { $regex: productName, $options: 'i' } };

        // Check if the user is an admin
        if (req.user && req.user.isAdmin) {
            // Admin can see inactive products
        } else {
            // Non-admin users should only see active products
            query.isActive = true;
        }

        const products = await Product.find(query);

        if (!products.length > 0) {
            return res.status(200).json({ message: "No products found with the given name" });
        }

        res.status(200).json({ products });
    } catch (err) {
        console.error("Error in searching products by name: ", err);
        next(err);
    }
}
/* ===== Search By Name Product Controller End ===== */

/* ===== Search By Price Product Controller Start ===== */
module.exports.searchByPrice = async (req, res, next) => {
    try {
        const { minPrice, maxPrice } = req.body;

        let query = {};

        if (minPrice && maxPrice) {
            query.price = { 
                $gte: minPrice,
                $lte: maxPrice 
            };
        } else if (minPrice) {
            query.price = { $gte: minPrice };
        } else if (maxPrice) {
            query.price = { $lte: maxPrice };
        } else {
            throw errorInfo(400, "At least one of minimum or maximum price should be provided");
        }

        // Check if the user is an admin
        if (req.user && req.user.isAdmin) {
            // Admin can see inactive products
        } else {
            // Non-admin users should only see active products
            query.isActive = true;
        }

        const products = await Product.find(query);

        if (!products.length > 0) {
            return res.status(200).json({ message: "No products found within the given price range" });
        }
        
        res.status(200).json({ products });   
    } catch (err) {
        console.error("Error in searching products by price: ", err);
        next(err);
    }
}
/* ===== Search By Price Product Controller End ===== */

/* ========== Product Controller Features End ========== */