const { Router } = require('express');
const router = Router();
const { isCustomer } = require('../../../middleware/auth');
const customerCtr = require('../../../controllers/customer');

router.use(isCustomer);

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

module.exports = router;