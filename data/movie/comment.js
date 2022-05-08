const mongoCollections = require("../../config/mongoCollections");
const comment = mongoCollections.comments;
const axios = require("axios");
const util = require("../utils/util");
const movie = require("./movie");

async function createComment(content, userName, movieId, date, rate) {
  const commentCollection = await comment();

  const likes = 0;
  const parentId = 0;
  let newComment = {
    userName: userName,
    movieId: movieId,
    content: content,
    parentId: parentId,
    date: date,
    likes: likes,
    rate: rate,
  };

  const insertInfo = await commentCollection.insertOne(newComment);
  if (insertInfo.insertedCount == 0) throw `Could not add a new user`;
  return {
    commentInserted: true,
  };
}

async function createReply(content, userName, movieId, date, rate, id) {
  const commentCollection = await comment();

  const likes = 0;
  const parentId = id;
  let newComment = {
    userName: userName,
    movieId: movieId,
    content: content,
    parentId: parentId,
    date: date,
    likes: likes,
    rate: rate,
  };

  const insertInfo = await commentCollection.insertOne(newComment);
  if (insertInfo.insertedCount == 0) throw `Could not add a new user`;
  return {
    commentInserted: true,
  };
}

async function getByMovieId(id) {
  const commentCollection = await comment();
  // let str = ".*" + name + ".*$";
  // let reg = new RegExp(str);
  if (!id) throw `You must provide an id`;
  util.checkString("id", id);
  // console.log(id);

  const comments = await commentCollection
    .find({
      movieId: id,
      parentId: 0, //$options: "i"  Ignore case
    })
    .toArray();
  comments.forEach((element) => {
    element._id = element._id.toString();
  });
  // console.log(comments);
  return comments;
}

async function getById(id) {
  const commentCollection = await comment();
  // let str = ".*" + name + ".*$";
  // let reg = new RegExp(str);
  if (!id) throw `You must provide an id`;
  util.checkString("id", id);
  // console.log(id);

  const comments = await commentCollection
    .find({
      parentId: id,
    })
    .toArray();

  comments.forEach((element) => {
    element._id = element._id.toString();
  });
  // console.log(comments);
  return comments;
}

async function calMovieRate(id) {
  if (!id) throw `id does not exist`;
  let sum = 0;
  let count = 0;
  const comments = await getByMovieId(id);
  // console.log(comments);

  comments.forEach((element) => {
    if (element.parentId == 0) {
      sum += element.rate;
      count += 1;
    }
  });

  const rate = Math.round((sum / count) * 10) / 10;
  // console.log(rate);
  await movie.updateRating(id, rate);
}

module.exports = {
  getByMovieId,
  createComment,
  calMovieRate,
  getById,
  createReply,
};
