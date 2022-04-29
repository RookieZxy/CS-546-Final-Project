const mongoConnections = require("../config/mongoCollections");
const mongoConnection = require("../config/mongoConnection");
const movieData = require("../data/movie/movie");
const { ObjectId } = require("mongodb");


var movieSeed = require("../public/json/movies.json");
movieSeed.forEach(function(movie){
  delete movie._id;
});

async function main() {
  const users = await mongoConnections.users();
  const movies = await mongoConnections.movies();
  const comments = await mongoConnections.comments();
  const type = await mongoConnections.type();

  const db = await mongoConnection.connectToDb();
  await db.dropDatabase();

  //user
  const user1 = {
    account: "mayuankai",
    password: "123123",
    isAdmin: true,
    firstName: "Yuankai",
    lastName: "Ma",
  };
  const user2 = {
    account: "zhouxiangyu",
    password: "123123",
    isAdmin: true,
    firstName: "Xiangyu",
    lastName: "Zhou",
  };
  const user3 = {
    account: "chenjunjie",
    password: "123123",
    isAdmin: true,
    firstName: "Junjie",
    lastName: "Chen",
  };
  const user4 = {
    account: "sunan",
    password: "123123",
    isAdmin: true,
    firstName: "An",
    lastName: "Sun",
  };
  const user5 = {
    account: "tangming",
    password: "123123",
    isAdmin: true,
    firstName: "Ming",
    lastName: "Tang",
  };
  

  //movie

  //comment
  const comment1 = {
    userId: "123123123",
    movieId: "123123123",
    content: "This the content of the comment",
    parentId: "2131231312",
    date: new Date("<2022-03-11>"),
    likes: 20,
    rate: 3.5,
  };
  

  //type
  const types = [
    {
      name: "Comedy",
    },
    {
      name: "Sci-Fi",
    },
    {
      name: "Horror",
    },
    {
      name: "Romance",
    },
    {
      name: "Action",
    },
    {
      name: "Thriller",
    },
    {
      name: "Drama",
    },
    {
      name: "Mystery",
    },
    {
      name: "Crime",
    },
    {
      name: "Animation",
    },
    {
      name: "Adventure",
    },
    {
      name: "Fantasy",
    },
    {
      name: "Comedy-Romance",
    },
    {
      name: "Action-Comedy",
    },
    {
      name: "Superhero",
    },
  ];


  await movies.insertMany(movieSeed);

  await users.insertOne(user1);
  await users.insertOne(user2);
  await users.insertOne(user3);
  await users.insertOne(user4);
  await users.insertOne(user5);
  await comments.insertOne(comment1);
  await type.insertMany(types);
  
  await mongoConnection.closeConnection();
}

main();
