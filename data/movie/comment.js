const mongoCollections = require('../../config/mongoCollections');
const comment = mongoCollections.comments;
const axios = require("axios");
const util = require("../utils/util");

async function createComment(content, userName, movieId, date, rate) {

    const commentCollection = await comment();

    const likes = 0;
    const parentId = 0;
    let newComment = {
        userName: userName,
        movieId: movieId,
        content: content,
        parentId:parentId,
        date: date,
        likes: likes,
        rate: rate,
    }


    const insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo.insertedCount == 0)
        throw `Could not add a new user`
    return {
        commentInserted: true
    }
}


async function getByMovieId(id) {
    const commentsCollection = await mongoCollections.comments();
    // let str = ".*" + name + ".*$";
    // let reg = new RegExp(str);
    if(!id)
        throw `You must provide an id`;
    util.
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
  

module.exports = {
    getByMovieId,
    createComment,
}