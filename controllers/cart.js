/* ===== Dependencies and Modules ===== */
/* ===== Models ===== */
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
/* ===== Middlewares ===== */
const { createError } = require("../middlewares/error.js");
/* ===== Helpers ===== */
const { 
    calculateTotalPrice,
    formatCart 
} = require("../helpers/priceFormatting.js");
const {
    findOrCreateUserCartLean,
    findOrCreateUserCart,
    updateCartWithItem,
    updateCartItemQuantity
} = require("../helpers/cartManagement.js");
/* ===== Validations ===== */
const { validateInputs } = require("../middlewares/validations.js");


/* ===== Cart Features ===== */
module.exports.getUserCart = async (req, res, next) => {
    try {
        const userCart = await findOrCreateUserCartLean(req.user.id);
        if (!userCart) throw createError(404, "User's cart not found");

        if (userCart.cartItems.length === 0)
            return res.status(200).json({ message: "User's cart is empty" });
        
        const formattedCart = formatCart(userCart);
        return res.status(200).json({ cart: formattedCart });
    } catch (err) {
        console.error("Error in getting user cart: ", err);
        return next(err);
    }
};

module.exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        if (!validateInputs(productId, quantity) || quantity <= 0)
            throw createError(400, "Invalid input data. Please provide a valid productId and a positive quantity");
        
        let cart = await findOrCreateUserCart(req.user.id);
        const product = await Product.findById(productId).lean();

        if (!product) throw createError(404, "Product does not exist");

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
        if (!validateInputs(productId, quantity) || quantity <= 0)
            throw createError(400, "Invalid input data. Please provide a valid productId and a positive quantity");

        const cart = await findOrCreateUserCart(req.user.id);
        if (!cart) throw createError(404, "Cart does not exist");

        await updateCartItemQuantity(cart, productId, quantity);

        const updatedCart = await Cart.findById(cart._id).lean();
        const formattedCart = formatCart(updatedCart);

        return res.status(200).json({ userCart: formattedCart });
    } catch (err) {
        console.error("Error in updating product quantity: ", err);
        return next(err);
    }
};

module.exports.removeProductFromCart = async (req, res, next) => {
    try {
        if (!req.params.productId.match(/^[0-9a-fA-F]{24}$/))
            throw createError(400, "Invalid product ID");
        const productId = req.params.productId;

        const userId = req.user.id;
        let cart = await findOrCreateUserCart(userId);

        const productIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));

        if (productIndex === -1) 
            throw createError(404, "Product not found in cart");

        cart.cartItems.splice(productIndex, 1);
        cart.totalPrice = calculateTotalPrice(cart.cartItems);

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).lean();
        const formattedCart = formatCart(updatedCart);

        return res.status(200).json({
            message: "Product removed from cart successfully", 
            updatedCart: formattedCart });
    } catch (err) {
        console.error("Error in removing the product: ", err);
        return next(err);
    }
};

module.exports.clearCartItems = async (req, res, next) => {
    try {
        const { deletedCount } = await Cart.deleteMany({ userId: req.user.id });
        if (deletedCount === 0) {
            throw createError(404, "No Items Available");
        }

        return res.status(200).json({ message: "All items cleared from the cart" });
    } catch (err) {
        console.error("Error in clearing the cart items: ", err);
        return next(err);
    }
};