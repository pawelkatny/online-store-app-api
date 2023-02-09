const { Router } = require("express");
const router = Router();
const { isAuthenticated } = require("../../../middleware/auth");
const { dashboard, checkMailerConfig } = require("../../../controllers/admin");

router.use(isAuthenticated);

router.route("/dashboard").get(dashboard);

module.exports = router;
