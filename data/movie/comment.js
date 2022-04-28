const mongoCollections = require('../../config/mongoCollections');
const comment = mongoCollections.comments;
const axios = require("axios");

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


module.exports = {
    createComment,
}