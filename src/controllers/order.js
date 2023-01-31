const CustomError = require("../error/customError");
const OrderService = require("../services/order");
const UserService = require("../services/user");
const CustomerService = require("../services/customer");
const { StatusCodes } = require("http-status-codes");

const getOrders = async (req, res) => {
  const currentUser = req.user;
  if (!currentUser.hasPermission("view-order")) {
    throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }
  const { query } = req;
  const orders = await OrderService.getOrders(query);

  res.status(StatusCodes.OK).json({ orders });
};

const getOrder = async (req, res) => {
  const currentUser = req.user;
  if (!currentUser.hasPermission("view-order")) {
    throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }
  const { orderId } = req.params;
  const order = await OrderService.getOrder(orderId);
  if (!order) {
    throw new CustomError("Not found", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({ order });
};

const createOrder = async (req, res) => {
  const currentUser = req.user;
  const { delivery, address, products, customerId } = req.body;
  let userData;

  if (customerId) {
    const user = await UserService.getUserById(customerId);
    userData = {
      name: user.name,
      email: user.email,
      id: user._id,
    };
  }

  if (currentUser.hasRole("customer")) {
    userData = {
      name: currentUser.name,
      email: currentUser.email,
      id: currentUser.id,
    };
  }

  const order = await OrderService.createOrder(userData, {
    delivery,
    address,
    products,
  });

  if (!order) {
    throw new CustomError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  if (currentUser.hasRole("customer")) {
    await CustomerService.clearCart(currentUser.id);
  }

  res.status(StatusCodes.CREATED).json({ order });
};

const updateOrder = async (req, res) => {
  const currentUser = req.user;

  if (!currentUser.hasPermission("edit-order")) {
    throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  const { orderId } = req.params;
  const orderData = { ...req.body };

  const order = await OrderService.updateOrder(orderId, orderData);

  if (!order) {
    throw new CustomError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
};
