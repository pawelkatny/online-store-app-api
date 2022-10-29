const { Router } = require('express');
const router = Router();

router.route('/dashboard').get((req, res) => {
    res.status(200).json({ msg: 'Admin dashboard '});
});

module.exports = router;