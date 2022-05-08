const express = require("express");
// const path = require("path");
const router = express.Router();
// const axios = require("axios");
const xss = require("xss");
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

//search sub comment
router.post("/searchSub", async (req, res) => {
    try {
        const parentId = req.body.parentId;
        if (!parentId) {
            throw `parentId does not exist!`
        }
        const comments = await commentData.getById(parentId);
        // console.log(comments);
        res.send(comments);
    } catch (e) {
        console.log(e);
        res.status(400).render('home/home', {
            login_flag: 'subCommentSearch',
            status: 'HTTP 400',
            error: e
        })
    }
});


//add sub comment
router.post("/reply", async (req, res) => {
    try {
        if (req.session.user == undefined)
            throw `Please login first`;
        if (!req.body.replyMessage)
            throw `content or rate do not exist!`;
        req.body.replyMessage = xss(req.body.replyMessage);
        const replyMessage = req.body.replyMessage;
        util.checkString("replyMessage", replyMessage);
        const movieId = req.body.movieId;
        const userName = req.body.userName;
        const parentId = req.body.parentId;

        var myDate = new Date();
        const date = myDate.toLocaleDateString();
        const rate = -1;

        const movie = await movieData.getById(movieId);
        const comment = await commentData.createReply(replyMessage, userName, movieId, date, rate, parentId);
        if (comment.commentInserted == true) {
            // res.render(`movie/details`, {
            //     movie: movie,
            //     userName: req.session.user.account,
            //     CSS: "detail.css",
            //     comment: 3,
            // });
            res.redirect(`../movie/${movieId}`)
        } else {
            throw `Did not comment.`
        }
    } catch (e) {
        console.log(e);
        const movie = await movieData.getById(req.body.movieId);
        if (req.session.user == undefined) {
            res.status(400).render(`movie/details`, {
                movie: movie,
                CSS: "detail.css",
                comment: 1,
                error: e,
            })
        } else{
            res.status(400).render(`movie/details`, {
                movie: movie,
                userName: req.session.user.account,
                CSS: "detail.css",
                comment: 1,
                error: e,
            })
        }
    }
});


module.exports = router;