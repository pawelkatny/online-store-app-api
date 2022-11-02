const { Router } = require('express');
const router = Router();
const { isAuthenticated, isAdmin } = require('../../../middleware/auth');
const { dashboard } = require('../../../controllers/admin');

router.route('/dashboard').get(isAuthenticated, isAdmin, dashboard);

module.exports = router;