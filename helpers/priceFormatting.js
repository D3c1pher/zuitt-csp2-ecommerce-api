// Helper function to format money values
function formatMoney(value) {
    const formattedValue = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
    return formattedValue;
}

// Helper function to calculate total price
function calculateTotalPrice(cartItems) {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
}

// Format money subtotal values in the cart before sending the response
function formatProductSubtotal(cart) {
    cart.cartItems.forEach(item => {
        item.subtotal = formatMoney(item.subtotal);
    });
    return cart;
} 

// Format money totalPrice values in the cart before sending the response
function formatProductTotalPrice(cart) {
    cart.totalPrice = formatMoney(cart.totalPrice);
    return cart;
}

// Format money values in the cart before sending the response
function formatCart(cart) {
    return formatProductSubtotal(formatProductTotalPrice(cart));
}

// Format money subtotal values in the order before sending the response
function formatOrderSubtotal(order) {
    order.productsOrdered.forEach(item => {
        item.subtotal = formatMoney(item.subtotal);
    });
    return order;
} 

// Format money totalPrice values in the order before sending the response
function formatOrderTotalPrice(order) {
    order.totalPrice = formatMoney(order.totalPrice);
    return order;
}

// Format money values in the order before sending the response
function formatOrder(order) {
    return formatOrderSubtotal(formatOrderTotalPrice(order));
}

module.exports = {
    calculateTotalPrice,
    formatMoney,
    formatProductSubtotal,
    formatProductTotalPrice,
    formatCart,
    formatOrderSubtotal,
    formatOrderTotalPrice,
    formatOrder
};