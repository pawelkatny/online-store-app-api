const { Router } = require("express");
const router = Router();
const orderCtr = require("../../../controllers/order");
const { isAuthenticated, isCustomer } = require("../../../middleware/auth");

router.use(isAuthenticated);

router.route("/").get(orderCtr.getOrders).post(orderCtr.createOrder);

router.route("/:orderId").get(orderCtr.getOrder).patch(orderCtr.updateOrder);

module.exports = router;
