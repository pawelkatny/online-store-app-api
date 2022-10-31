const { Router } = require('express');
const router = Router();
const authController = require('../../../controllers/auth');

router.route('/register').post(authController.register);

router.route('/login').get((req, res) => {
    res.status(200).json({ msg: 'Login'});
});

router.route('/logout').get((req, res) => {
    res.status(200).json({ msg: 'Logout'});
});


module.exports = router;