const { Router } = require('express');
const router = Router();
const { isAuthenticated } = require('../../../middleware/auth');
const userCtr = require('../../../controllers/user');

router.route('/')
    .get(isAuthenticated, userCtr.getUsers)
    .post(isAuthenticated, userCtr.createUser);

router.route('/:id')
    .get(isAuthenticated, userCtr.getUser)
    .patch(isAuthenticated, userCtr.updateUser)
    .delete(isAuthenticated, userCtr.deleteUser)

router.route('/me').get((req, res) => {
    res.status(200).json({ msg: 'Get Current User Account' });
});

router.route('/password').get((req, res) => {
    res.status(200).json({ msg: 'User Pwd ' });
});

router.route('/password/reset').get((req, res) => {
    res.status(200).json({ msg: 'User pwd reset ' });
});

module.exports = router;