const { Router } = require('express');
const router = Router();

router.route('/about').get((req, res) => {
    res.status(200).json({ msg: 'About page '});
});

router.route('/help').get((req, res) => {
    res.status(200).json({ msg: 'About page '});
});

router.route('/terms').get((req, res) => {
    res.status(200).json({ msg: 'About page '});
});

router.route('/privacy-policy').get((req, res) => {
    res.status(200).json({ msg: 'About page '});
});


module.exports = router;