const { Router } = require('express');
const router = Router();

router.route('/register').get((req, res) => {
    res.status(200).json({ msg: 'Register '});
});

router.route('/login').get((req, res) => {
    res.status(200).json({ msg: 'Login'});
});

router.route('/logout').get((req, res) => {
    res.status(200).json({ msg: 'Logout'});
});


module.exports = router;