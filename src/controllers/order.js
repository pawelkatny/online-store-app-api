const CustomError = require('../error/customError');
const OrderService = require('../services/order');
const CustomerService = require('../services/customer');
const { StatusCodes } = require('http-status-codes');

const getOrders = async (req, res) => {
    const { query } = req;

    const queryObject = {};
    const orders = await OrderService.getOrders(queryObject);

    res.status(StatusCodes.OK).json({ orders });
}

const getOrder = async (req, res) => {
    const { orderId } = req.params;
    const order = await OrderService.getOrder(orderId);
    if (!order) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({ order });
}

const createOrder = async (req, res) => {
    const currentUser = req.user;
    const { delivery, address, products } = orderData;

    const order = await OrderService.createOrder(currentUser.id, {
        delivery, address, products
    });
    if (!order) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    await CustomerService.clearCart(currentUser.id);

    res.status(StatusCodes.CREATED).json({ order });
}