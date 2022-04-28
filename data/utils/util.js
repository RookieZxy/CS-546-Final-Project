const { ObjectId } = require("mongodb");
const moment = require("moment");

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
  if (!moment(date, "MM/DD/YYYY", true).isValid())
    throw `${date} wrong format of date. Please input MM/DD/YYYY`;
  return date;
}

function isValidString(s) {
  if (typeof s === "string") {
    s = s.trim();
    if (s.length === 0) throw "Empty string!";
    else return s;
  } else throw `Wrong type. ${s} is not string.`;
}

function isValidRating(rating) {
  if (typeof rating !== "number")
    throw "Wrong type. Rating must be type of number.";
  if (rating < 0 || rating > 5) throw "Invalied rating, must in range of 1~5";
  return Number(rating.toFixed(1));
}

function checkPassword(password) {
  if (typeof password !== "string") throw `${password} is not a string`;
  if (password.indexOf(" ") != -1) throw `password shouln'd have spaces`;
  if (password.length < 6)
    throw `password shouldn't be empty spaces and should be at least 6 characters`;
  if (password.length > 16)
    throw `password shouldn't be more than 16 characters`;
}

function checkAccount(username) {
  username = username.trim();
  if (typeof username !== "string") throw `${username} is not a string`;
  if (username.length < 4)
    throw `username shouldn't be empty spaces and it'length should be at least 4 characters`;
  if (username.length > 16)
    throw `The length of username shouldn't be more than 16`;
  if (username.indexOf(" ") != -1) throw `username shouln'd have spaces`;
  var Regx = /^[A-Za-z0-9]*$/;
  if (!Regx.test(username))
    throw "username should only be combained by alphanumeric characters";
}

function checkName(firstName, lastName) {
  if (typeof firstName !== "string" || typeof lastName !== "string")
    throw `firstName and lastName should be string`;
  firstName = firstName.trim();
  lastName = lastName.trim();
  if (firstName.length == 0 || lastName.length == 0)
    throw `firstName and lastName should not be empty spaces`;
}

function checkString(name, str) {
  if (typeof str != "string") throw `${name} is not a string`;
  str = str.trim();
  if (str.length <= 0) throw `${name} is an empty string`;
}
module.exports = {
  checkString,
  checkName,
  checkAccount,
  checkPassword,
  isValidMovie,
  isValidString,
  isValidRating,
  isObjectId,
  isValidDateString,
};
