const { ObjectId } = require("mongodb");

function isObjectId(id) {
  id = isValidString(id);
  if (!ObjectId.isValid(id)) throw "Invalid ObjectId";
  else return id;
}

function isValidMovie(movie) {
  /*
  movie.countries = data.countries;
  movie.keywords = data.keywordList;
  movie.trailerLink = trailerData.linkEmbed;
  movie.images = imgData.items;
  movie.typeList
  */
  movie.date = isValidDateString(movie.date);
  isValidRating(movie.rating);
  isValidRuntime(movie.runtime);
  movie.casts = isValidString(movie.casts);
  movie.imdbId = isValidString(movie.imdbId);
  movie.name = isValidString(movie.name);
  movie.directors = isValidString(movie.directors);
  movie.writers = isValidString(movie.writers);
  movie.languages = isValidString(movie.languages);
  movie.runtime = isValidString(movie.runtime);
  movie.poster = isValidString(movie.poster);
  return movie;
}

function isValidDateString(date) {
  date = isValidString(date);
  if (!moment(date, "YYYY-MM-DD", true).isValid())
    throw `${date} wrong format of date. Please input YYYY-MM-DD`;
  return date;
}

function isValidString(s) {
  if (typeof s === "string") {
    s = s.trim();
    if (s.length === 0) throw "Empty string!";
    else return s;
  } else throw `Wrong type. ${s} is not string.`;
}
function isValidRuntime(runtime) {
  if (typeof runtime !== "number")
    throw "Wrong type. Rating must be type of number.";
  if (runtime < 0 || runtime > 500)
    throw "Invalied runtime, must in range of 0~500";
}

function isValidRating(rating) {
  if (typeof rating !== "number")
    throw "Wrong type. Rating must be type of number.";
  if (rating < 0 || rating > 5) throw "Invalied rating, must in range of 1~5";
  return Number(rating.toFixed(1));
}

module.exports = {
  isValidMovie,
  isValidString,
  isValidRating,
  isObjectId,
  isValidDateString,
  isValidRuntime,
};
