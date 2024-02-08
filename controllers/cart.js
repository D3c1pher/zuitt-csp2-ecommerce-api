/* ===== Dependencies and Modules ===== */
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const { createError } = require("../middlewares/error.js");
const { 
    calculateTotalPrice, 
    formatMoney,
    formatCart } = require("../helpers/priceFormatting.js");
const {
    findOrCreateUserCartLean,
    findOrCreateUserCart,
    updateCartWithItem,
    updateCartItemQuantity
} = require("../helpers/cartManagement.js");


/* ===== Cart Features ===== */
module.exports.getUserCart = async (req, res, next) => {
    try {
        const userCart = await findOrCreateUserCartLean(req.user.id);
        if (!userCart) {
            throw createError(404, "User's cart not found.");
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
            throw createError(400, "Invalid input data. Please provide a valid productId and a positive quantity.");
        }
        
        let cart = await findOrCreateUserCart(req.user.id);
        const product = await Product.findById(productId).lean();

        if (!product) {
            throw createError(404, "Product not found.");
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
        const cart = await findOrCreateUserCart(req.user.id);
        if (!cart) {
            throw createError(404, "Cart not found.");
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

module.exports.removeProductFromCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.user.id;

        let cart = await findOrCreateUserCart(userId);

        const productIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));

        if (productIndex === -1) {
            throw createError(404, "Product not found in cart.");
        }

        cart.cartItems.splice(productIndex, 1);
        cart.totalPrice = calculateTotalPrice(cart.cartItems);

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).lean();
        const formattedCart = formatCart(updatedCart);

        return res.status(200).json({ message: "Product removed from cart successfully", updatedCart: formattedCart });
    } catch (err) {
        console.error("Error in removing the product: ", err);
        return next(err);
    }
};

module.exports.clearCartItems = async (req, res, next) => {
    try {
        const { deletedCount } = await Cart.deleteMany({ userId: req.user.id });
        if (deletedCount === 0) {
            throw createError(404, "No Items Available.");
        }

        return res.status(200).json({ message: "All items cleared from the cart." });
    } catch (err) {
        console.error("Error in clearing the cart items: ", err);
        return next(err);
    }
};

module.exports.searchByName = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name || typeof name !== 'string' || name.trim() === '') {
            throw createError(400, "Please provide a valid product name to search.");
        }

        const product = await Product.findOne({ name: { $regex: new RegExp(name, "i") } });
        if (!product) {
            throw createError(404, "Product not found with the given name.");
        }

        const cart = await findOrCreateUserCartLean(req.user.id);
        if (!cart) {
            throw createError(404, "Cart not found for the user.");
        }

        const cartItem = cart.cartItems.find(item => item.productId.equals(product._id));
        if (!cartItem) {
            throw createError(404, "Product not found in the user's cart.");
        }

        cartItem.subtotal = formatMoney(cartItem.subtotal);

        return res.status(200).json({ cartItem });
    } catch (err) {
        console.error("Error in searching items by name: ", err);
        return next(err);
    }
};

module.exports.searchByPrice = async (req, res, next) => {
    try {
        const { minPrice, maxPrice } = req.body;

        if (typeof minPrice !== 'number' || typeof maxPrice !== 'number' || minPrice < 0 || maxPrice < 0) {
            throw createError(400, "Please provide valid minimum and maximum prices.");
        }

        if (minPrice >= maxPrice) {
            throw createError(400, "Minimum price must be less than maximum price.");
        }

        const productsWithinPriceRange = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
        if (productsWithinPriceRange.length === 0) {
            throw createError(404, "No products found within the specified price range.");
        }
        
        const cart = await findOrCreateUserCartLean(req.user.id);
        if (!cart) {
            throw createError(404, "Cart not found for the user.");
        }

        const cartItems = cart.cartItems.filter(item => {
            return productsWithinPriceRange.some(product => product._id.equals(item.productId));
        });

        cartItems.forEach(item => {
            item.subtotal = formatMoney(item.subtotal);
        });

        return res.status(200).json({ cartItems });
    } catch (err) {
        console.error("Error in searching products by price: ", err);
        return next(err);
    }
};