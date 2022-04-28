const settings = require("../../config/settings.json");
const apiKey = settings.imdb.apiKey;
const axios = require("axios");
const util = require("../utils/util");
const mongoCollections = require("../../config/mongoCollections");
const { ObjectId } = require("mongodb");
const mongoConnection = require("../../config/mongoConnection");

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
  movie.releaseDate = new Date(data.releaseDate);
  movie.name = data.title;
  movie.plot = data.plot;
  movie.casts = data.stars;
  movie.directors = data.directors;
  movie.writers = data.writers;
  movie.languages = data.languages;
  movie.runtime = data.runtimeStr;
  movie.poster = data.image;
  movie.awards = data.awards;
  movie.countries = data.countries;
  movie.keywords = data.keywordList;
  movie.trailerLink = trailerData.linkEmbed;
  movie.images = imgData.items;

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
  movie.isValid = false; //Movie can be valid after admin has approved.
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
  // const movies = await moviesCollection
  //   .find({
  //     name: { $regex: reg, $options: "i" }, //$options: "i"  Ignore case
  //   })
  //   .toArray();

  return movies;
}

async function getById(id) {
  id = util.isObjectId(id);
  const moviesCollection = await mongoCollections.movies();
  const movie = await moviesCollection.findOne({ _id: ObjectId(id) });
  if (movie === null) throw `No movie with id '${id}'`;
  movie._id = movie._id.toString();
  movie.releaseDate = new Date(movie.releaseDate);
  return movie;
}

// Query the database.movie and find all movies with typeName in typeList. 
async function getByType(typeName) {
  if (!typeName || typeof typeName != 'string') throw `invalid typename: '${typeName}'`;
  const moviesCollection = await mongoConnections.movies();
  const movie = await moviesCollection.find( {typeList: typeName} );
  if (movie === null) throw `No movie with typeName '${typeName}`;
  movie._id = movie._id.toString();
  movie.releaseDate = new Date(movie.releaseDate);
  console.log ('movie: ', movie);
  return movie;
}

// Query the database.type to get all movie types.
async function getAllTypes(){
  const typeCollection = await mongoConnections.type();
  const types = typeCollection.find();
  if (types === null) throw 'No types.';
  console.log ('types: ', types);
  return types
}

async function getByName(name) {
  const moviesCollection = await mongoCollections.movies();
  let str = ".*" + name + ".*$";
  let reg = new RegExp(str);
  const movies = await moviesCollection
    .find({
      name: { $regex: reg, $options: "i" }, //$options: "i"  Ignore case
    })
    .toArray();

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    movie._id = movie._id.toString();
    movie.releaseDate = new Date(movie.releaseDate);
  }
  // console.log(movies);
  return movies;
}

async function getByImdbId(imdbId) {
  const moviesCollection = await mongoCollections.movies();

  const movie = await moviesCollection.findOne({ imdbId: imdbId });
  if (movie === null) throw `No movie with imdbId '${imdbId}'`;
  movie._id = movie._id.toString();
  movie.releaseDate = new Date(movie.releaseDate);
  return movie;
}

async function getSimilar(id) {}

async function changeValidation(id, isValid) {
  id = util.isObjectId(id);

  const movie = await getById(id);
  movie.isValid = isValid;

  return await modify(movie);
}

async function updateRating(id, rating) {
  console.log(id);
  console.log(rating);
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
  changeValidation,
  getAllTypes,
};
