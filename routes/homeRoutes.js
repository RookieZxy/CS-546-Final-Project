const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('home/home')
});
router.get('/userInfo', async (req, res) => {
    const username = req.session.user.account;
    //console.log(username);
    const isAdmin= req.session.user.isAdmin;
    res.send({username: username, isAdmin: isAdmin});
// router.get('/', async (req, res) => {
//     res.render('home/home', {login_flag: 'home', username: req.session.user.account})
// });

module.exports = router;
