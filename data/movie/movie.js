const settings = require("../../config/settings.json");
const apiKey = settings.imdb.apiKey;
// const apiKey = settings.imdb.apiKey_Alternative;
const axios = require("axios");
const util = require("../utils/util");
const mongoCollections = require("../../config/mongoCollections");
const { ObjectId } = require("mongodb");
const mongoConnection = require("../../config/mongoConnection");
const moment = require("moment");

async function queryFromImdb(imdbId) {
  const movie = { imdbId: imdbId };
  movie.typeList = [];
  const data1 = await axios.get(
    `https://imdb-api.com/en/API/Title/${apiKey}/${imdbId}`
  );
  const data = data1.data;
  if (data.title === null) {
    throw `No movie with IMDB Id '${imdbId}'`;
  }
  const data2 = await axios.get(
    `https://imdb-api.com/en/API/Images/${apiKey}/${imdbId}`
  );
  const imgData = data2.data;
  const data3 = await axios.get(
    `https://imdb-api.com/en/API/Trailer/${apiKey}/${imdbId}`
  );
  const trailerData = data3.data;

  movie.rating = 0;
  movie.releaseDate = data.releaseDate;
  movie.name = data.title;
  movie.plot = data.plot;
  movie.casts = data.stars;
  movie.directors = data.directors;
  movie.writers = data.writers;
  movie.languages = data.languages;
  movie.runtime = data.runtimeMins;
  movie.poster = data.image;
  movie.awards = data.awards;
  movie.countries = data.countries;
  movie.keywords = data.keywordList;
  movie.trailerLink = trailerData.linkEmbed;
  movie.images = imgData.items;
  // movie.isValid = true;

  const types = data.genreList;
  for (let i = 0; i < types.length; i++) {
    let value = types[i].value;
    movie.typeList.push(value);
  }

  return movie;

  /**
   imDbRating
   similars
   */
}

async function add(movie) {
  util.isValidMovie(movie);
  movie.releaseDate = new Date(movie.releaseDate);
  const moviesCollection = await mongoCollections.movies();
  const insertInfo = await moviesCollection.insertOne(movie);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add new movie";

  return insertInfo.insertedId.toString();
}

async function modify(movie) {
  util.isValidMovie(movie);
  //will throw an error if values in movie are all same with old one
  id = ObjectId(movie._id);
  delete movie["_id"];
  movie.releaseDate = new Date(movie.releaseDate);
  const moviesCollection = await mongoCollections.movies();
  const updateInfo = await moviesCollection.updateOne(
    { _id: id },
    {
      $set: movie,
    }
  );
  if (updateInfo.modifiedCount === 0)
    throw "Could not update movie successfully";

  movie._id = id.toString();
  return movie;
}

async function del(id) {
  id = util.isObjectId(id);
  const moviesCollection = await mongoCollections.movies();
  const movie = await getById(id);
  if (movie === null) {
    throw `No movie with id '${id}'`;
  }
  const deletedCount = await moviesCollection.deleteOne({ _id: ObjectId(id) });
  if (deletedCount === 0) throw `Could not delete movie with id of ${id}`;
  else {
    movie._id = movie._id.toString();
    return movie;
  }
}

async function getTopRated() {
  const moviesCollection = await mongoCollections.movies();
  var topRatedMovies = await moviesCollection
    .aggregate([
      { $sort: { rating: -1 } },
      { $limit: 10 },
      { $project: { _id: 1, imdbId: 1, name: 1, rating: 1 } },
    ])
    .toArray();

  for (let i = 0; i < topRatedMovies.length; i++) {
    topRatedMovies[i]._id = topRatedMovies[i]._id.toString();
    //console.log(topRatedMovies[i]._id);
  }
  //console.log(topRatedMovies);
  return topRatedMovies;
}

async function getInvalid() {
  const moviesCollection = await mongoCollections.movies();

  const movies = await moviesCollection.find({ isValid: false }).toArray();

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    movie._id = movie._id.toString();
    const date = moment(movie.releaseDate);
    movie.releaseDate = date.format("YYYY-MM-DD");
  }
  return movies;
}

async function getById(id) {
  id = util.isObjectId(id);
  const moviesCollection = await mongoCollections.movies();
  const movie = await moviesCollection.findOne({ _id: ObjectId(id) });
  if (movie === null) throw `No movie with id '${id}'`;
  movie._id = movie._id.toString();
  // movie.releaseDate = new Date(movie.releaseDate);
  const date = moment(movie.releaseDate);
  movie.releaseDate = date.format("YYYY-MM-DD");
  return movie;
}

// Query the database.movie and find all movies with typeName in typeList. Sort the return by sortBy
async function getByType(typeName, sortBy) {
  if (!typeName || typeof typeName != "string")
    throw `invalid typename: '${typeName}'`;
  if (!sortBy || typeof sortBy != "string") throw `invalid sortBy: '${sortBy}'`;

  const moviesCollection = await mongoCollections.movies();
  var movie = null;
  if (sortBy == "ratingLH") {
    movie = await moviesCollection
      .find(
        { typeList: typeName },
        { name: 1, poster: 1, rating: 1, runtime: 1 }
      )
      .sort({ rating: 1 })
      .toArray();
  } else if (sortBy == "ratingHL") {
    movie = await moviesCollection
      .find(
        { typeList: typeName },
        { name: 1, poster: 1, rating: 1, runtime: 1 }
      )
      .sort({ rating: -1 })
      .toArray();
  } else if (sortBy == "releaseDateNew") {
    movie = await moviesCollection
      .find(
        { typeList: typeName },
        { name: 1, poster: 1, rating: 1, runtime: 1 }
      )
      .sort({ releaseDate: -1 })
      .toArray();
  } else {
    movie = await moviesCollection
      .find(
        { typeList: typeName },
        { name: 1, poster: 1, rating: 1, runtime: 1 }
      )
      .sort({ releaseDate: 1 })
      .toArray();
  }

  if (movie === null) throw `No movie with typeName '${typeName}`;

  return movie;
}

// Query the database.type to get all movie types.
async function getAllTypes() {
  const typeCollection = await mongoCollections.type();
  const types = await typeCollection
    .find({}, { projection: { _id: 0, name: 1 } })
    .toArray();
  if (types === null) throw "No types.";
  //console.log ('types: ', types);
  return types;
}

// Query the database randomly, to display recommendation movies on main page.
async function get3MovieRand() {
  const moviesCollection = await mongoCollections.movies();
  const threeMovies = await moviesCollection
    .aggregate([
      { $sample: { size: 3 } },
      {
        $project: { _id: 1, imdbId: 1, name: 1, plot: 1, poster: 1, images: 1 },
      },
    ])
    .toArray();
  //console.log(threeMovies);
  for (let i = 0; i < threeMovies.length; i++) {
    threeMovies[i]._id = threeMovies[i]._id.toString();
  }
  return threeMovies;
}

// Query the database randomly, get 4 movies that different from imdbId. To display in the movie detail page.
async function get4MovieByImdbIdRand(imdbId) {
  //util.isValidString(imdbId);
  const moviesCollection = await mongoCollections.movies();
  const fourMovies = await moviesCollection
    .find({ imdbId: { $ne: imdbId } })
    //.aggregate( [ { $sample: { size : 1 } } , { $project : { _id: 0, imdbId: 1, name: 1, plot: 0, poster: 0, images: 0 } } ] )
    .toArray();
  //console.log(fourMovies.name);
  return fourMovies;
}

// Get typeList by ObjectId. Return first element of typeList of a movie.
async function getTypeById(id) {
  id = util.isObjectId(id);
  const moviesCollection = await mongoCollections.movies();
  const movie = await moviesCollection.findOne({ _id: ObjectId(id) });
  //.toArray();
  if (movie === []) throw "No movie with id: " + id;
  if (!movie.typeList || movie.typeList.length < 1)
    throw "No typeList in the movie with id: " + id;
  return movie.typeList[0];
}

// Query the database randomly, get 4 movies that different from id. To display in the movie detail page.
async function get4SimilarMovieByIdRand(id) {
  id = util.isObjectId(id);
  //console.log(id);
  const type = await getTypeById(id);
  //console.log (type);
  const moviesCollection = await mongoCollections.movies();
  var fourMovies = await moviesCollection
    .aggregate([
      { $match: { _id: { $ne: ObjectId(id) }, typeList: { $in: [type] } } },
      { $sample: { size: 4 } },
      {
        $project: { _id: 1, imdbId: 1, name: 1, plot: 1, poster: 1, images: 1 },
      },
    ])
    .toArray();

  for (let i = 0; i < fourMovies.length; i++) {
    //console.log(fourMovies[i]);
    fourMovies[i]._id = fourMovies[i]._id.toString();
  }
  //console.log(fourMovies);
  return fourMovies;
}

async function getByName(name) {
  const moviesCollection = await mongoCollections.movies();
  let str = ".*" + name + ".*$";
  let reg = new RegExp(str);
  const movies = await moviesCollection
    .find({
      name: { $regex: reg, $options: "i" }, //$options: "i"  Ignore case
      isValid: true,
    })
    .toArray();

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    movie._id = movie._id.toString();
    const date = moment(movie.releaseDate);
    movie.releaseDate = date.format("YYYY-MM-DD");
  }
  // console.log(movies);
  return movies;
}

async function getByCast(cast) {
  const moviesCollection = await mongoCollections.movies();
  let str = ".*" + cast + ".*$";
  let reg = new RegExp(str);
  const movies = await moviesCollection
    .find({
      casts: { $regex: reg, $options: "i" }, //$options: "i"  Ignore case
      isValid: true,
    })
    .toArray();

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    movie._id = movie._id.toString();
    const date = moment(movie.releaseDate);
    movie.releaseDate = date.format("YYYY-MM-DD");
  }
  // console.log(movies);
  return movies;
}

async function getByDirector(director) {
  const moviesCollection = await mongoCollections.movies();
  let str = ".*" + cast + ".*$";
  let reg = new RegExp(str);
  const movies = await moviesCollection
    .find({
      directors: { $regex: reg, $options: "i" }, //$options: "i"  Ignore case
      isValid: true,
    })
    .toArray();

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    movie._id = movie._id.toString();
    const date = moment(movie.releaseDate);
    movie.releaseDate = date.format("YYYY-MM-DD");
  }
  // console.log(movies);
  return movies;
}

async function getByImdbId(imdbId) {
  const moviesCollection = await mongoCollections.movies();

  const movie = await moviesCollection.findOne({ imdbId: imdbId });
  // if (movie === null) throw `No movie with imdbId '${imdbId}'`;
  if (movie === null) return null;
  movie._id = movie._id.toString();
  const date = moment(movie.releaseDate);
  movie.releaseDate = date.format("YYYY-MM-DD");
  return movie;
}

async function getSimilar(id) {}

async function approveMovie(movie) {
  util.isValidMovie(movie);
  movie.isValid = true;

  return await modify(movie);
}

async function updateRating(id, rating) {
  util.isValidRating(rating);
  id = util.isObjectId(id);

  const movie = await getById(id);
  movie.rating = rating;

  return await modify(movie);
}

module.exports = {
  queryFromImdb,
  add,
  modify,
  del,
  getById,
  getByType,
  getByName,
  getSimilar,
  updateRating,
  getByImdbId,
  getTopRated,
  approveMovie,
  getAllTypes,
  getInvalid,
  getByCast,
  getByDirector,
  get3MovieRand,
  get4MovieByImdbIdRand,
  get4SimilarMovieByIdRand,
};
