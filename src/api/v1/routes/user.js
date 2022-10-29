const { Router } = require('express');
const router = Router();

router.route('/').get((req, res) => {
    res.status(200).json({ msg: 'Get Users '});
});

router.route('/:id').get((req, res) => {
    res.status(200).json({ msg: 'Get User'});
});

router.route('/account').get((req, res) => {
    res.status(200).json({ msg: 'Get User Account '});
});

router.route('/password').get((req, res) => {
    res.status(200).json({ msg: 'User Pwd '});
});

router.route('/password/reset').get((req, res) => {
    res.status(200).json({ msg: 'User pwd reset '});
});

module.exports = router;