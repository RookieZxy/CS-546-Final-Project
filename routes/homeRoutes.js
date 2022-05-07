const express = require('express');
const { isDate } = require('moment');
const router = express.Router();
const movieData = require('../data/movie/movie')

router.get('/', async (req, res) => {
    // if(req.session.user)
    //     res.render('home/home',{user: req.session.user})
    // else
    const types = await movieData.getAllTypes();
    const threeMovies = await movieData.get3MovieRand();
    const topRatedMovies = await movieData.getTopRated();
    //console.log(topRatedMovies);

    res.render('home/home', {types: types, threeMovies: threeMovies, topRatedMovies: topRatedMovies});
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
    // console.log(isAdmin);
    res.send({
        username: username,
        isAdmin: isAdmin
    });
});

router.get('/types/:id', async (req, res) => {
    const type = req.params.id;
    if (!type || typeof type != 'string')throw `invalide type name: '${type}'`;
    //console.log("type in route: ", type);
    var sortBy = 'ratingHL';
    //console.log("sortBy in route: ", sortBy);
    try{
        const moviesByType = await movieData.getByType(type, sortBy);
        res.status(200).render('movie/types', {title: type+" movies", type: type, movies: moviesByType, amount: moviesByType.length});
    }catch(e){
        res.status(400).send({error: error});
    }
    
});

router.post('/types/:id', async (req, res) => {
    const type = req.params.id;
    if (!type || typeof type != 'string')throw `invalide type name: '${type}'`;
    //console.log("type in post route: ", type);
    var sortBy = req.body.sortBy;
    if (!sortBy) sortBy = 'ratingLH';
    //console.log("sortBy in post route: ", sortBy);
    try{
        const moviesByType = await movieData.getByType(type, sortBy);
        res.json(moviesByType);
    }catch(error){
        console.log(error);
    }
});

// router.get('/', async (req, res) => {
//     res.render('home/home', {login_flag: 'home', username: req.session.user.account})
// });

module.exports = router;