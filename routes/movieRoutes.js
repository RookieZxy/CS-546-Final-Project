const express = require("express");
// const path = require("path");
const router = express.Router();
const axios = require("axios");

router.get("", async (req, res) => {
  console.log(123123123123);
  const { data } = await axios.get(
    `https://imdb-api.com/en/API/Title/k_o8ajco4w/tt0068646`
  );
  // res.render("movie/movieDetails", { data: data });
  res.render("movie/movieDetails", {});
});

module.exports = router;
