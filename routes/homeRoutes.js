const express = require('express');
const router = express.Router();
const movieData = require('../data/movie/movie')

router.get('/', async (req, res) => {
    // if(req.session.user)
    //     res.render('home/home',{user: req.session.user})
    // else
    const types = await movieData.getAllTypes();
    //console.log(types);

    res.render('home/home', {types: types});
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

router.get('/types/:id', async (req, res) => {
    const type = req.params.id;
    if (!type || typeof type != 'string')throw `invalide type name: '${type}'`;
    const moviesByType = await movieData.getByType(type);
    //console.log("moviesByType: ", moviesByType);
    res.render('movie/types', {type: type, movies: moviesByType});
});


// router.get('/', async (req, res) => {
//     res.render('home/home', {login_flag: 'home', username: req.session.user.account})
// });

module.exports = router;