const express = require("express");
// const path = require("path");
const router = express.Router();
const axios = require("axios");
const util = require("../data/utils/util");
const movieData = require("../data/movie/movie");
const commentData = require("../data/movie/comment");

router.get("/invalidList", async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect("/");
    return;
  }

  let movies = [];
  try {
    movies = await movieData.getInvalid();
  } catch (error) {
    res.status(500).send({ error: error });
  }

  res.render("movie/invalidList", { title: "To Be Audited", movies: movies });
});

router.get("/addMovie", (req, res) => {
  //is Login
  // console.log(req.session.user)
  if (req.session.user == undefined) {
    res.redirect("/");
  } else {
    res.render("movie/addMovie", {
      title: "Add Movie",
      partial: "addMovie-scripts",
      JS: "addMovie",
    });
  }
});

router.get("/approve/", (req, res) => {
  res.status(400).send({ error: "Invalid id" });
});

router.get("/approve/:id", async (req, res) => {
  //is admin
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect("/");
    return;
  }
  let id = req.params.id;
  try {
    id = util.isValidString(id);
  } catch (error) {
    res.status(400).send({ error: "Invalid _id" });
    return;
  }
  res.render("movie/addMovie", {
    title: "Manage Movie",
    _id: id,
    JS: "manageMovie",
  });
});

router.get("/approveInfo/", (req, res) => {
  res.status(400).send({ error: "Invalid id" });
});

router.get("/approveInfo/:id", async (req, res) => {
  //is admin
  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect("/");
    return;
  }
  let id = req.params.id;
  try {
    id = util.isValidString(id);
  } catch (error) {
    res.status(400).send({ error: "Invalid _id" });
    return;
  }
  movie = await movieData.getById(id);
  // try {
  //   movie = await movieData.getById(id);
  // } catch (error) {
  //   res.status(500).send({ error: error });
  //   return;
  // }

  res.send({ movie: movie });
});

router.post("/manage", async (req, res) => {
  //is Login is admin
  if (!req.session.user || !req.session.user.isAdmin) {
    res.status(401).send({
      error: "Unauthorized. Please Login",
    });
    return;
  }
  const movie = req.body;
  movie.isValid = true;

  try {
    if (!movie._id) {
      throw "No movie _id";
    }
    util.isValidMovie(movie);
  } catch (error) {
    res.status(400).send({
      error: error,
    });
    return;
  }
  try {
    await movieData.modify(movie);
    res.send({
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
});
router.post("/addMovie", async (req, res) => {
  //is Login
  if (!req.session.user) {
    res.status(401).send({
      error: "Unauthorized. Please Login",
    });
    return;
  }
  const movie = req.body;
  //is admin
  if (req.session.user.isAdmin) {
    movie.isValid = true;
  } else movie.isValid = false;
  try {
    util.isValidMovie(movie);
  } catch (error) {
    res.status(400).send({
      error: error,
    });
    return;
  }
  try {
    const id = await movieData.add(movie);
    res.send({
      isSuccess: true,
      id: id,
    });
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
});

router.get("/imdb/:id", async (req, res) => {
  let imdbId = req.params.id;
  try {
    imdbId = util.isValidString(imdbId);
    // is existed movie
    const movie1 = await movieData.getByImdbId(imdbId);
    if (movie1 !== null) {
      res.status(200).send({ isExisted: true, id: movie1._id });
      return;
    }

    const movie = await movieData.queryFromImdb(imdbId);
    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
});

router.get("/imdb/", (req, res) => {
  res.status(400).send({
    error: "Please input a IMDB Id",
  });
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    id = util.isObjectId(id);
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }

  try {
    const movie = await movieData.getById(id);
    const fourSimilarMovies = await movieData.get4SimilarMovieByIdRand(id);
    //console.log (fourSimilarMovies);
    movie.imageShow = [];
    for (let i = 0; i < 9; i++) {
      const img = movie.images[i];
      movie.imageShow.push(img);
    }
    if (req.session.user)
      res.render("movie/details", {
        title: movie.name,
        movie: movie,
        fourSimilarMovies: fourSimilarMovies,
        userName: req.session.user.account,
        CSS: "detail.css",
      });
    //
    else
      res.render("movie/details", {
        title: movie.name,
        movie: movie,
        fourSimilarMovies: fourSimilarMovies,
        CSS: "detail.css",
      });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
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
    if (movie[0] == undefined) {
      res.render("search/search", {
        title: `search ${movieSearch}`,
        search: movieSearch,
        amount: 0,
      });
    }
    //res.send(movie);
    //console.log(movie.length());
    const amount = movie.length;
    res.render("search/search", {
      title: `search ${movieSearch}`,
      movie: movie,
      amount: amount,
      search: movieSearch,
    });
  } catch (e) {
    console.log(e);

    res.status(400).send({ error: e });
  }
});

//comment
router.post("/comment", async (req, res) => {
  try {
    if (req.session.user == undefined) throw `Please login first`;
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
    // if (comment.commentInserted == true) {
    //   commentData.calMovieRate(movieId);
    //   res.render(`movie/details`, {
    //     movie: movie,
    //     userName: req.session.user.account,
    //     CSS: "detail.css",
    //     comment: true,
    //   });
    // } else {
    //   throw `Did not comment.`;
    // }
    if (comment.commentInserted == true) {
      await commentData.calMovieRate(movieId);
      res.status(200).send({
        movie: movie,
        userName: req.session.user.account,
        CSS: "detail.css",
        // comment: 1,
      });
    } else {
      res.status(500).send({
        movie: movie,
        userName: req.session.user.account,
        CSS: "detail.css",
        error: "Did not comment",
        // comment: 1,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({
      error: e,
    });
  }
});


//search movie
router.post("/rating", async (req, res) => {
  try {
    const movieSearch = req.body.move_name;
    if (!movieSearch) {
      throw `movie does not exist!`;
    }
    const movie = await movieData.getByName(movieSearch);
    if (movie[0] == undefined) {
      throw `can not find error`
    }
    res.status(200).send({
      rating: movie[0].rating
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
});

/*
//calculate rate
router.get('/getRate', async (req, res) => {
  try {
    const movieId = req.body.movieId;
    const getRate = await commentData.calMovieRate(movieId);
    const movie = await movieData.getByName(getRate);

    res.render('movie/details', {movie: movie});
  } catch (e) {
    console.log(e);
    res.status(400).send({
      error: e,
    });
  }
});
*/

module.exports = router;
