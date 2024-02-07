const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");


/* ===== Helper Functions ===== */

// Helper function to create user's cart
async function findUserCartLean(userId) {
    return await Cart.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, cartItems: [] } },
        { upsert: true, new: true }
    ).lean();
}

// Helper function to get user's cart
async function findUserCart(userId) {
    return await Cart.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, cartItems: [] } },
        { upsert: true, new: true }
    )
}

// Helper function to get product by ID
async function getProductById(productId) {
    return await Product.findById(productId);
}

/* ========== ========== */

// Helper function to calculate total price
function calculateTotalPrice(cartItems) {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
}

// Helper function to format money values
function formatMoney(value) {
    const formattedValue = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
    return formattedValue;
}

// Format money subtotal values in the cart before sending the response
function formatCartSubtotal(cart) {
    cart.cartItems.forEach(item => {
        item.subtotal = formatMoney(item.subtotal);
    });
    return cart;
} 

// Format money totalPrice values in the cart before sending the response
function formatCartTotalPrice(cart) {
    cart.totalPrice = formatMoney(cart.totalPrice);
    return cart;
}

// Format money values in the cart before sending the response
function formatCart(cart) {
    return formatCartSubtotal(formatCartTotalPrice(cart));
}

// // Format money values in the cart before sending the response
// function formatCart(cart) {
//     cart.cartItems.forEach(item => {
//         item.subtotal = formatMoney(item.subtotal);
//     });
//     cart.totalPrice = formatMoney(cart.totalPrice);
//     return cart;
// }

/* ========== ========== */

// Helper function to update cart with new item
function updateCartWithItem(cart, productId, quantity, subtotal) {
    const existingItemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex !== -1) {
        cart.cartItems[existingItemIndex].quantity += quantity;
        cart.cartItems[existingItemIndex].subtotal += subtotal;
    } else {
        cart.cartItems.push({ productId, quantity, subtotal });
    }

    cart.totalPrice = calculateTotalPrice(cart.cartItems);
    cart.save();
}

// Helper function to update cart item quantity
async function updateCartItemQuantity(cart, productId, quantity) {
    const cartItem = cart.cartItems.find(item => item.productId.toString() === productId);

    if (cartItem) {
        cartItem.quantity = quantity;
        const product = await getProductById(productId);
        if (product) {
            cartItem.subtotal = product.price * quantity;
        }
    }

    cart.totalPrice = calculateTotalPrice(cart.cartItems);
    cart.save();
}


module.exports = {
    findUserCartLean,
    findUserCart,
    getProductById,
    calculateTotalPrice,
    formatMoney,
    formatCartSubtotal,
    formatCartTotalPrice,
    formatCart,
    updateCartWithItem,
    updateCartItemQuantity
};