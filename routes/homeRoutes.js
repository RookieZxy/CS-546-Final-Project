const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('home/home')
});
// router.get('/', async (req, res) => {
//     res.render('home/home', {login_flag: 'home', username: req.session.user.account})
// });

module.exports = router;
