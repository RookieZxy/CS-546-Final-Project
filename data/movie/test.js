const settings = require("../../config/settings.json");
const apiKey = settings.imdb.apiKey;
const axios = require("axios");

let imdbId = "tt0068646";

async function test() {
  /**
   poster
   images
   trailer
   language
   writer
   runtimeStr
   awards
   countries
   imDbRating
   keywords
   similars
   */

  const { data } = await axios.get(
    `https://imdb-api.com/en/API/Title/${apiKey}/${imdbId}`
  );

  //    https://imdb-api.com/en/API/Images/k_o8ajco4w/tt1375666/Short
  //    https://imdb-api.com/en/API/Trailer/k_o8ajco4w/tt1375666
  //    https://imdb-api.com/en/API/YouTubeTrailer/k_o8ajco4w/tt1375666

  console.log(data);
}

test();
