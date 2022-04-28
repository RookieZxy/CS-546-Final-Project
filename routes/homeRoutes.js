const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    // if(req.session.user)
    //     res.render('home/home',{user: req.session.user})
    // else
    res.render('home/home')
});
router.get('/userInfo', async (req, res) => {
    let username = null;
    //console.log(username);
    let isAdmin = false;
    if (req.session.user) {
        username = req.session.user.account;
        //console.log(username);
        isAdmin = req.session.user.isAdmin;
    }
    res.send({
        username: username,
        isAdmin: isAdmin
    });
});

// router.get('/', async (req, res) => {
//     res.render('home/home', {login_flag: 'home', username: req.session.user.account})
// });

module.exports = router;