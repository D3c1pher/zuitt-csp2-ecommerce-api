/* ===== Dependencies and Modules ===== */
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const { errorInfo } = require("../middlewares/error.js");

/* ========== Cart Controller Features Start ========== */

/* ===== View Cart Controller Start ===== */
module.exports.viewCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOneAndUpdate(
            { userId },
            { $setOnInsert: { userId, cartItems: [] } },
            { upsert: true, new: true }
        ).lean();

        if (!cart || cart.cartItems.length === 0) {
            return res.status(200).json({ message: "Cart is empty" });
        }

        // Formatting money-related fields
        cart.cartItems.forEach(item => {
            item.subtotal = Number(item.subtotal).toFixed(2);
        });
        cart.totalPrice = Number(cart.totalPrice).toFixed(2);

        return res.status(200).json({ cart });
    } catch (err) {
        console.error("Error in viewing cart: ", err);
        next(err);
    }
}
/* ===== View Cart Controller End ===== */

/* ===== Add To Cart Controller Start ===== */
module.exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        if(!productId) {
            throw errorInfo(400, "Product ID is required");
        }

        // If quantity is not provided or not a valid number, default it to 1
        const itemQuantity = parseInt(quantity) || 1;

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId: req.user.id, cartItems: [] });
        }
        
        const product = await Product.findById(productId);

        if (!product) {
            throw errorInfo(404, "Product does not exist");
        }

        if (!product.isActive) {
            throw errorInfo(400, "Product is not available");
        }

        // Check if the product already exists in the cart
        const existingItemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex !== -1) {
            // If the product already exists, update the quantity and subtotal
            cart.cartItems[existingItemIndex].quantity += itemQuantity;
            cart.cartItems[existingItemIndex].subtotal += product.price * itemQuantity;
        } else {
            // Calculate subtotal for the product
            const subtotal = product.price * itemQuantity;

            // Add the product to the cart items
            cart.cartItems.push({
                productId: product._id,
                quantity: itemQuantity,
                subtotal: subtotal
            });
        }

        // Update the total price of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => {
            return total + item.subtotal;
        }, 0).toFixed(2);

        // Save the cart
        cart = await cart.save();

        return res.status(200).json({ cart });
    } catch (err) {
        console.error("Error in adding product to cart: ", err);
        next(err);
    }
}
/* ===== Add To Cart Controller End ===== */

/* ===== Update Product Quantity Controller Start ===== */
module.exports.updateProductQuantity = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            throw errorInfo(404, "Cart not found");
        }

        // Find the index of the product in the cart
        const productIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            throw errorInfo(404, "Product not found in cart");
        }

        // Get the product details
        const product = await Product.findById(productId);

        if (!product) {
            throw errorInfo(404, "Product not found");
        }

        if (!product.isActive) {
            throw errorInfo(400, "Product is not available");
        }

        // If quantity is not provided or not a valid number, default it to 1
        const updatedQuantity = quantity ? parseInt(quantity) : 1;

        // Update the quantity of the product
        cart.cartItems[productIndex].quantity = updatedQuantity;

        // If the quantity is 0, remove the product from the cart
        if (updatedQuantity === 0) {
            cart.cartItems.splice(productIndex, 1);
        } else {
            // Update subtotal for the specific product
            cart.cartItems[productIndex].subtotal = product.price * updatedQuantity;
        }

        // Recalculate the total price of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => {
            return total + item.subtotal;
        }, 0).toFixed(2);

        // Save the updated cart
        cart = await cart.save();

        return res.status(200).json({ cart });
    } catch (err) {
        console.error("Error in updating quantity of product in cart: ", err);
        next(err);
    }
}
/* ===== Update Product Quantity Controller End ===== */

/* ===== Remove From Cart Controller Start ===== */
module.exports.removeFromCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.user.id;

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            throw errorInfo(404, "Cart not found");
        }

        // Check if the product exists in the cart
        const productIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            throw errorInfo(404, "Product not found in the cart");
        }

        // Remove the product from the cart
        cart.cartItems.splice(productIndex, 1);

        // Recalculate the total price of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => {
            return total + item.subtotal;
        }, 0).toFixed(2);

        // Save the updated cart
        cart = await cart.save();

        return res.status(200).json({ cart });
    } catch (err) {
        console.error("Error in removing product from cart: ", err);
        next(err);
    }
};
/* ===== Remove From Cart Controller End ===== */

/* ===== Clear Cart Controller Start ===== */
module.exports.clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            throw errorInfo(404, "Cart not found");
        }

        // Clear the cart items
        cart.cartItems = [];

        // Reset the total price to zero
        cart.totalPrice = 0;

        // Save the updated cart
        cart = await cart.save();

        return res.status(200).json({ cart });
    } catch (err) {
        console.error("Error in clearing cart: ", err);
        next(err);
    }
};
/* ===== Clear Cart Controller End ===== */

/* ========== Cart Controller Features End ========== */