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


module.exports = {
    calculateTotalPrice,
    formatMoney,
    formatCartSubtotal,
    formatCartTotalPrice,
    formatCart,
};