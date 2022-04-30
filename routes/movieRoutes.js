const express = require("express");
// const path = require("path");
const router = express.Router();
const axios = require("axios");
const util = require("../data/utils/util");
const movieData = require("../data/movie/movie");
const commentData = require("../data/movie/comment");

router.get("/addMovie", (req, res) => {
  //is Login
  if (!req.session.user) {
    res.redirect("/");
  }
  res.render("movie/addMovie", {});
});

router.get("/approve/:id", (req, res) => {
  //is admin
  if (!req.session.user.isAdmin) {
    res.redirect("/");
  }

  let id = req.params.id;
  res.render("movie/addMovie", { _id: id });
});

router.post("/addMovie", async (req, res) => {
  //is Login
  if (!req.session.user) {
    res.redirect("/");
  }
  const movie = req.body;
  //is admin
  if (req.session.user.isAdmin) {
    movie.isValid = true;
  } else movie.isValid = false;
  try {
    util.isValidMovie(movie);
    const id = await movieData.add(movie);
    res.send({ isSuccess: true, id: id });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

router.get("/imdb/:id", async (req, res) => {
  let imdbId = req.params.id;
  try {
    imdbId = util.isValidString(imdbId);
    //is existed movie
    // const movie1 = await movieData.getByImdbId(imdbId);
    // if (movie1 !== null) {
    //   res.status(200).send({ isExisted: true, id: movie1._id });
    //   return;
    // }

    // const movie = await movieData.queryFromImdb(imdbId);
    const movie = await movieData.getByImdbId(imdbId);
    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

router.get("/imdb/", (req, res) => {
  res.status(400).send({ error: "Please input a IMDB Id" });
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    id = util.isObjectId(id);
  } catch (error) {
    res.status(400).json({ error: error });
  }

  try {
    const movie = await movieData.getById(id);
    movie.imageShow = [];
    for (let i = 0; i < 9; i++) {
      const img = movie.images[i];
      movie.imageShow.push(img);
    }
    if (req.session.user)
      res.render("movie/details", {
        movie: movie,
        userName: req.session.user.account,
        CSS: "detail.css",
      });
    //
    else res.render("movie/details", { movie: movie, CSS: "detail.css" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//search movie
router.post("/search", async (req, res) => {
  try {
    const movieSearch = req.body.search_termInput;
    if (!movieSearch) {
      throw `movie does not exist!`;
    }
    const movie = await movieData.getByName(movieSearch);
    res.send(movie);
  } catch (e) {
    console.log(e);
    res.status(400).render("home/home", {
      login_flag: "movieSearch",
      status: "HTTP 400",
      error: e,
    });
  }
});

//comment
router.post("/comment", async (req, res) => {
  try {
    if (!req.body.content || !req.body.rate)
      throw `content or rate do not exist!`;
    const content = req.body.content;
    util.checkString("content", content);
    //const commentChild = req.body.commentChild;
    const userName = req.body.userName;

    const movieId = req.body.movieId;
    var myDate = new Date();
    const date = myDate.toLocaleDateString();
    const rate = parseFloat(req.body.rate);

    const movie = await movieData.getById(movieId);
    // console.log(rate);

    const comment = await commentData.createComment(
      content,
      userName,
      movieId,
      date,
      rate
    );
    if (comment.commentInserted == true) {
      commentData.calMovieRate(movieId);
      res.render(`movie/details`, {
        movie: movie,
        userName: req.session.user.account,
        CSS: "detail.css",
        comment: true,
      });
    } else {
      throw `Did not comment.`;
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
