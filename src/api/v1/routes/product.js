const { Router } = require('express');
const router = Router();

router.route('/').get((req, res) => {
    res.status(200).json({ msg: 'Get Products '});
});

module.exports = router;