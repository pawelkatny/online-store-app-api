const { Router } = require('express');
const router = Router();
const authController = require('../../../controllers/auth');

router.route('/register').post(authController.register);

router.route('/login').post(authController.login);

router.route('/request-password-reset').post(authController.requestPasswordReset);

router.route('/reset-password')
    .post(authController.resetPassword);

router.route('/activate-account/token/:token').get(authController.activateAccount);

module.exports = router;