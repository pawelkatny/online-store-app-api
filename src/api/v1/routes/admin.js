const { Router } = require('express');
const router = Router();
const { isAuthenticated } = require('../../../middleware/auth');
const { dashboard } = require('../../../controllers/admin');

router.route('/dashboard').get(isAuthenticated, dashboard);

module.exports = router;