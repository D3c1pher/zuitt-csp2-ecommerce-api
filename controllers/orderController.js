/* ===== Dependencies and Modules ===== */
const Cart = require("../models/Cart.js");
const Order = require("../models/Order.js");
const { errorInfo } = require("../middlewares/error.js");

/* ========== Order Controller Features Start ========== */

/* ===== Checkout Order Controller Start ===== */
module.exports.checkout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('cartItems.productId');

        if (!cart) {
            throw errorInfo(404, "Cart is empty");
        }

        if (cart.cartItems.length === 0) {
            throw errorInfo(400, "Cart is empty");
        }

        let totalPrice = 0;
        cart.cartItems.forEach(item => {
            totalPrice += item.subtotal;
        });

        const order = new Order({
            userId: cart.userId,
            productsOrdered: cart.cartItems.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            totalPrice: totalPrice
        });

        await order.save();

        await cart.deleteOne();

        res.status(201).json({ 
            message: "Order is checkout successfully",
            order 
        });
    } catch (err) {
        console.error("Error in checking out order: ", err);
        next(err);
    }
};
/* ===== Checkout Order Controller End ===== */

/* ===== View My Orders Controller Start ===== */
module.exports.viewMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId }).populate({
            path: 'productsOrdered.productId',
            select: 'name'
        }).lean();

        if (!orders || orders.length === 0) {
            throw errorInfo(404, "No orders found");
        }

        return res.status(200).json({ orders });
    } catch (err) {
        console.error("Error in viewing your orders: ", err);
        return next(err);
    }
};
/* ===== View My Orders Controller End ===== */

/* ===== View All Orders Controller Start ===== */
module.exports.viewAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate({
            path: 'userId',
            select: 'email'
        }).lean();;

        if (!orders || orders.length === 0) {
            throw errorInfo(404, "Orders not found");
        }

        return res.status(200).json({ orders });
    } catch (err) {
        console.error("Error in viewing all orders: ", err);
        return next(err);
    }
};
/* ===== View All Orders Controller Start ===== */

/* ========== Order Controller Features End ========== */