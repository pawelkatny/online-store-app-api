const { Router } = require('express');
const router = Router();
const orderCtr = require('../../../controllers/order');
const { isAuthenticated, isCustomer } = require('../../../middleware/auth');

router.route('/')
    .get(isAuthenticated, orderCtr.getOrders)
    .post(isCustomer, orderCtr.createOrder);

router.route('/:orderId')
    .get(isAuthenticated, orderCtr.getOrder);

module.exports = router;