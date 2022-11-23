const { Router } = require('express');
const router = Router();
const returnCtr = require('../../../controllers/return');
const { isAuthenticated } = require('../../../middleware/auth');

router.use(isAuthenticated);

router.route('/')
    .get(returnCtr.getReturns)
    .post(returnCtr.createReturn);

router.route('/:returnId')
    .get(returnCtr.getReturn);

module.exports = router;