const express = require("express");
// const path = require("path");
const router = express.Router();
const axios = require("axios");
const util = require("../data/utils/util");
const movieData = require("../data/movie/movie");

// router.get("", async (req, res) => {
//   console.log(123123123123);
//   const { data } = await axios.get(
//     `https://imdb-api.com/en/API/Title/k_o8ajco4w/tt0068646`
//   );
//   // res.render("movie/movieDetails", { data: data });
//   res.render("movie/movieDetails", {});
// });
<<<<<<< Updated upstream
=======
router.get("/addMovie", (req, res) => {
  //is Login
  if (!req.session.user) {
    res.redirect("/");
  }
  res.render("movie/addMovie", {});
});

router.get("/imdb/:id", async (req, res) => {
  let imdbId = req.params.id;
  try {
    imdbId = util.isValidString(imdbId);
    const movie = await movieData.getByImdbId(imdbId);
    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

router.get("/imdb/", (req, res) => {
  res.status(400).send({ error: "Please input a IMDB Id" });
});
>>>>>>> Stashed changes

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    id = util.isObjectId(id);
  } catch (error) {
    res.status(400).json({ error: error });
  }

  try {
    const movie = await movieData.getById(id);
    // movie.releaseDate = movie.releaseDate.getUTCDate();
    movie.releaseDate = `${movie.releaseDate.getMonth()}/${movie.releaseDate.getDate()}/${movie.releaseDate.getFullYear()}`;
    movie.imageShow = [];
    for (let i = 0; i < 9; i++) {
      const img = movie.images[i];
      movie.imageShow.push(img);
    }
    res.render("movie/details", { movie: movie, CSS: "detail.css" }); //
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
