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
    const commentCollection = await comment();
    // let str = ".*" + name + ".*$";
    // let reg = new RegExp(str);
    if(!id)
        throw `You must provide an id`;
    util.checkString("id", id);



    const comments = await commentCollection
      .find({
        movieId: id,
        parentId: 0, //$options: "i"  Ignore case
      }).toArray();
  
    // console.log(movies);
    return comments;
  }
  

module.exports = {
    getByMovieId,
    createComment,
}