const { Router } = require('express');
const router = Router();
const meRoutes = require('./customer');
const { isAuthenticated } = require('../../../middleware/auth');
const userCtr = require('../../../controllers/user');

router.use(isAuthenticated);

router.route('/')
    .get(userCtr.getUsers)
    .post(userCtr.createUser);

router.route('/:id(!\/me)')
    .get(userCtr.getUser)
    .patch(userCtr.updateUser)
    .delete(userCtr.deleteUser)

router.route('/password').get((req, res) => {
    res.status(200).json({ msg: 'User Pwd ' });
});

router.route('/password/reset').get((req, res) => {
    res.status(200).json({ msg: 'User pwd reset ' });
});

router.use('/me', meRoutes);

module.exports = router;