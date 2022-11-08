const { Router } = require('express');
const router = Router();
const productCtr = require('../../../controllers/product');
const { isAuthenticated } = require('../../../middleware/auth');

router.route('/')
    .get(productCtr.getProducts)
    .post(isAuthenticated, productCtr.createProduct);

router.route('/:productId')
    .get(productCtr.getProduct)
    .patch(isAuthenticated, productCtr.updateProduct)
    .delete(isAuthenticated, productCtr.deleteProduct);

module.exports = router;