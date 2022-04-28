const express = require("express");
// const path = require("path");
const router = express.Router();
const axios = require("axios");
const util = require("../data/utils/util");
const movieData = require("../data/movie/movie");
const commentData = require("../data/movie/comment");



//search comment
router.post("/search", async (req, res) => {
    try {
        const movieId = req.body.movieId;
        if (!movieId) {
            throw `movieId does not exist!`
        }
        const comments = await commentData.getByMovieId(movieId);
        res.send(comments);
    } catch (e) {
        console.log(e);
        res.status(400).render('home/home', {
            login_flag: 'commentSearch',
            status: 'HTTP 400',
            error: e
        })
    }
});


module.exports = router;