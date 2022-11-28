const { Router } = require('express');
const router = Router();
const meRoutes = require('./customer');
const { isAuthenticated } = require('../../../middleware/auth');
const userCtr = require('../../../controllers/user');

router.use(isAuthenticated);

router.route('/')
    .get(userCtr.getUsers)
    .post(userCtr.createUser);

router.route('/:userId([a-fA-F\\d]{24})')
    .get(userCtr.getUser)
    .patch(userCtr.updateUser)
    .delete(userCtr.deleteUser)

router.route('/password').get((req, res) => {
    res.status(200).json({ msg: 'User Pwd ' });
});

router.use('/me', meRoutes);

module.exports = router;