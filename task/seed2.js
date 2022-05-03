const mongoConnections = require("../config/mongoCollections");
const mongoConnection = require("../config/mongoConnection");
const movieData = require("../data/movie/movie");
const { ObjectId } = require("mongodb");

async function main() {
  const users = await mongoConnections.users();
  const movies = await mongoConnections.movies();
  const comments = await mongoConnections.comments();
  const type = await mongoConnections.type();

  const db = await mongoConnection.connectToDb();
  

  //movie

  //mongoexport --jsonArray --collection=movies --db=CS546_A_GROUP_13 --out=movies.json
  try{
        const movie1 = await movieData.queryFromImdb("tt0114709");
        await movieData.add(movie1);
    }
    catch(e){
        console.log(e);
    };

  try{
        const movie2 = await movieData.queryFromImdb("tt0082096");
        await movieData.add(movie2);
    }
    catch(e){
        console.log(e);
    };

    try{
        const movie3 = await movieData.queryFromImdb("tt2380307");
        await movieData.add(movie3);
    }
    catch(e){
        console.log(e);
    };

    try{
        const movie4 = await movieData.queryFromImdb("tt0361748");
        await movieData.add(movie4);
    }
    catch(e){
        console.log(e);
    };

    try{
        const movie5 = await movieData.queryFromImdb("tt0119698");
        await movieData.add(movie5);
    }
    catch(e){
        console.log(e);
    };
  
    try{
        const movie6 = await movieData.queryFromImdb("tt0087843");
        await movieData.add(movie6);
    }
    catch(e){
        console.log(e);
    };

  try{
        const movie7 = await movieData.queryFromImdb("tt4154796");
        await movieData.add(movie7);
    }
    catch(e){
        console.log(e);
    };

    try{
        const movie8 = await movieData.queryFromImdb("tt0119217");
        await movieData.add(movie8);
    }
    catch(e){
        console.log(e);
    };

    try{
        const movie9 = await movieData.queryFromImdb("tt0180093");
        await movieData.add(movie9);
    }
    catch(e){
        console.log(e);
    };

    try{
        const movie10 = await movieData.queryFromImdb("tt0435761");
        await movieData.add(movie10);
    }
    catch(e){
        console.log(e);
    };
  
  
  await mongoConnection.closeConnection();
}

main();
