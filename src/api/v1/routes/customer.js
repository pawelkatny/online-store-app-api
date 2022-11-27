const { Router } = require('express');
const router = Router();
const { isCustomer } = require('../../../middleware/auth');
const customerCtr = require('../../../controllers/customer');

router.use(isCustomer);

router.route('/')
    .get(customerCtr.getSummary);

router.route('/info')
    .get(customerCtr.getInfo)
    .post(customerCtr.updateInfo);

router.route('/addresses')
    .get(customerCtr.getAddresses)
    .post(customerCtr.addAddress);

router.route('/addresses/:addressId')
    .get(customerCtr.getAddress)
    .patch(customerCtr.updateAddress)
    .delete(customerCtr.deleteAddress)

router.route('/favorites')
    .get(customerCtr.getFavProducts)
    .post(customerCtr.addProductToFav);

router.route('/favorites/:productId')
    .delete(customerCtr.removeProductFromFav);

router.route('/cart')
    .get(customerCtr.getCart)
    .post(customerCtr.addToCart)
    .delete(customerCtr.clearCart);

router.route('/cart/product/:productId')
    .patch(customerCtr.updateProductCart)
    .delete(customerCtr.removeFromCart);

router.route('/checkout')
    .get(customerCtr.checkout);

router.route('/orders')
    .get(customerCtr.showOrdersHistory);

router.route('/orders/:orderId')
    .get(customerCtr.showOrder)

router.route('/returns')
    .get(customerCtr.showReturnsHistory);

router.route('/returns/:returnId')
    .get(customerCtr.showReturn);

module.exports = router;