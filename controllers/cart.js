const Cart = require("../models/Cart.js");
// const Product = require("../models/Product.js");
const { createError } = require("../utils/error.js");
const { 
    getUserCart,
    createUserCart,
    getProductById,
    updateCartWithItem,
    formatCart,
    updateCartItemQuantity 
} = require("../helpers/cartHelper.js");


/* ===== Cart Features ===== */

module.exports.getUserCart = async (req, res, next) => {
    try {
        const userCart = await getUserCart(req.user.id);

        if (!userCart) {
            return next(createError(404, "User's cart not found."));
        }

        if (userCart.cartItems.length === 0) {
            return res.status(200).json({ message: "User's cart is empty." });
        }
        
        const formattedCart = formatCart(userCart);

        return res.status(200).json({ userCart: formattedCart });
    } catch (err) {
        console.error("Error in getting user cart: ", err);
        return next(err);
    }
};

module.exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            return next(createError(400, "Invalid input data. Please provide a valid productId and a positive quantity."));
        }

        let cart = await createUserCart(req.user.id);

        const product = await getProductById(productId);
        
        if (!product) {
            return next(createError(404, "Product not found."));
        }

        const subtotal = product.price * quantity;

        updateCartWithItem(cart, productId, quantity, subtotal);

        cart = await Cart.findById(cart._id).lean();

        const formattedCart = formatCart(cart);

        return res.status(200).json({ userCart: formattedCart });
    } catch (err) {
        console.error("Error in adding to cart: ", err);
        return next(err);
    }
};

module.exports.updateProductQuantity = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        
        const cart = await createUserCart(req.user.id);

        if (!cart) {
            return next(createError(404, "Cart not found."));
        }

        await updateCartItemQuantity(cart, productId, quantity);

        const updatedCart = await Cart.findById(cart._id).lean(); 

        const formattedCart = formatCart(updatedCart);

        return res.status(200).json({ userCart: formattedCart });
    } catch (err) {
        console.error("Error in updating product quantity: ", err);
        return next(err);
    }
};


/* ===== ===== */


// // Remove product from cart
// exports.removeProductFromCart = async (req, res) => {
//     const { productId } = req.params;
//     try {
//         const cart = await Cart.findOne({ user: req.user.id });
//         if (!cart) {
//             return res.status(404).json({ message: "Cart not found" });
//         }
//         cart.items = cart.items.filter(item => item.product.toString() !== productId);
//         await cart.save();
//         res.json(cart);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Clear all items from cart
// exports.clearCartItems = async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.user.id });
//         if (!cart) {
//             return res.status(404).json({ message: "Cart not found" });
//         }
//         cart.items = [];
//         await cart.save();
//         res.json(cart);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Search products in cart by name
// exports.searchByName = async (req, res) => {
//     const { name } = req.body;
//     try {
//         const cart = await Cart.findOne({ user: req.user.id }).populate({
//             path: "items.product",
//             match: { name: { $regex: new RegExp(name, "i") } }
//         });
//         const filteredItems = cart ? cart.items.filter(item => item.product !== null) : [];
//         res.json(filteredItems);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Search products in cart by price
// exports.searchByPrice = async (req, res) => {
//     const { minPrice, maxPrice } = req.body;
//     try {
//         const cart = await Cart.findOne({ user: req.user.id }).populate({
//             path: "items.product",
//             match: { price: { $gte: minPrice, $lte: maxPrice } }
//         });
//         const filteredItems = cart ? cart.items.filter(item => item.product !== null) : [];
//         res.json(filteredItems);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };