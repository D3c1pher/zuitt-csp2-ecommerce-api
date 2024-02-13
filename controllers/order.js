/* ===== Dependencies and Modules ===== */
const Cart = require("../models/Cart.js");
const Order = require("../models/Order.js");
const { createError } = require("../middlewares/error.js");
const { formatOrder } = require("../helpers/priceFormatting.js");


/* ===== Order Features ===== */
module.exports.checkoutOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).lean();

        if (!cart || cart.cartItems.length === 0) {
            throw createError(400, "Your cart is empty. Cannot create an order.");
        }

        const totalPrice = cart.totalPrice;

        const order = new Order({
            userId,
            productsOrdered: cart.cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            totalPrice
        });

        await order.save();

        orderInfo = await Order.findById(order._id).lean();
        const formattedOrder = formatOrder(orderInfo);

        await Cart.findOneAndUpdate({ userId }, { $set: { cartItems: [], totalPrice: 0 } });

        res.status(201).json({ order: formattedOrder });
    } catch (err) {
        console.error("Error in checking out order: ", err);
        next(err);
    }
};

module.exports.getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await Order.findOne({ userId });

        if (!orders)
            throw createError(404, "Order does not exist");

        orderInfo = await Order.findById(orders._id).lean();
        const formattedOrder = formatOrder(orderInfo);

        return res.status(200).send({ orders: formattedOrder });
    } catch (err) {
        console.error("Error in finding your orders: ", err);
        return next(err);
    }
};

/* ========== ========== */

module.exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({});

        if(!orders.length > 0)
            throw createError(404, "No Orders found");

        const formattedOrders = orders.map(order => formatOrder(order));

        return res.status(200).send({ orders: formattedOrders });
    } catch (err) {
        console.error("Error in finding orders: ", err);
        return next(err);
    }
};