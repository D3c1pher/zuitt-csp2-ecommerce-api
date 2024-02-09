/* ===== Dependencies and Modules ===== */
/* ===== Models ===== */
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
/* ===== Helpers ===== */
const { calculateTotalPrice } = require("./priceFormatting.js");


// Finds or creates a user's cart and returns it in a lean format
async function findOrCreateUserCartLean(userId) {
    return await Cart.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, cartItems: [] } },
        { upsert: true, new: true }
    ).lean();
}

// Finds or creates a user's cart
async function findOrCreateUserCart(userId) {
    return await Cart.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, cartItems: [] } },
        { upsert: true, new: true }
    );
}

// Updates cart with a new item or increments the quantity of an existing item
async function updateCartWithItem(cart, productId, quantity, subtotal) {
    const existingItem = cart.cartItems.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal += subtotal;
    } else {
        const product = await Product.findById(productId).lean();
        if (product) {
            cart.cartItems.push({ productId, quantity, subtotal: product.price * quantity });
        }
    }

    cart.totalPrice = calculateTotalPrice(cart.cartItems);
    await cart.save();
}

// Updates cart item quantity
async function updateCartItemQuantity(cart, productId, quantity) {
    const cartItem = cart.cartItems.find(item => item.productId.toString() === productId);

    if (cartItem) {
        cartItem.quantity = quantity;
        const product = await Product.findById(productId).lean();
        if (product) {
            cartItem.subtotal = product.price * quantity;
        }
    }

    cart.totalPrice = calculateTotalPrice(cart.cartItems);
    await cart.save();
}


module.exports = {
    findOrCreateUserCartLean,
    findOrCreateUserCart,
    updateCartWithItem,
    updateCartItemQuantity
};