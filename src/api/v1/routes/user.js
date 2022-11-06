const { Router } = require('express');
const router = Router();
const { isAuthenticated } = require('../../../middleware/auth');
const userCtr = require('../../../controllers/user');

router.use(isAuthenticated);

router.route('/')
    .get(userCtr.getUsers)
    .post(userCtr.createUser);

router.route('/:id')
    .get(userCtr.getUser)
    .patch(userCtr.updateUser)
    .delete(userCtr.deleteUser)

router.route('/me').get((req, res) => {
    res.status(200).json({ msg: 'Get Current User Account' });
});

router.route('/me/addresses')
    .get(userCtr.getCustomerAddresses)
    .post(userCtr.addCustomerAddress);

router.route('/me/addresses/:id')
    .get(userCtr.getCustomerAddress)
    .patch(userCtr.updateCustomerAddress)
    .delete(userCtr.deleteCustomerAddress)

router.route('/password').get((req, res) => {
    res.status(200).json({ msg: 'User Pwd ' });
});

router.route('/password/reset').get((req, res) => {
    res.status(200).json({ msg: 'User pwd reset ' });
});

module.exports = router;