const mongoConnections = require("../config/mongoCollections");
const mongoConnection = require("../config/mongoConnection");
const { ObjectId } = require("mongodb");

async function main() {
  const users = await mongoConnections.users();
  const movies = await mongoConnections.movies();
  const comments = await mongoConnections.comments();
  const type = await mongoConnections.type();

  const db = await mongoConnection.connectToDb();
  await db.dropDatabase();

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
  await users.insertOne(user1);
  await users.insertOne(user2);
  await users.insertOne(user3);
  await users.insertOne(user4);
  await users.insertOne(user5);

  const movie1 = {
    IMDBid: "123123123",
    rate: 9.3,
    date: new Date("<1994-10-14>"),
    type: ["123123123"],
    name: "The Shawshank Redemption",
    casts: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    director: "Frank Darabont",
    introduce:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  };
  const movie2 = {
    IMDBid: "123123123",
    rate: 9.2,
    date: new Date("<1972-10-14>"),
    type: ["123123123"],
    name: "The Godfather",
    casts: ["Marlon Brando", "Al Pacino", "James Caan"],
    director: "Francis Ford Coppola",
    introduce:
      "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.",
  };
  const movie3 = {
    IMDBid: "123123123",
    rate: 9.3,
    date: new Date("<2008-10-14>"),
    type: ["123123123"],
    name: "The Dark Knight",
    casts: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    director: "Christopher Nolan",
    introduce:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  };
  const movie4 = {
    IMDBid: "123123123",
    rate: 8.6,
    date: new Date("<1977-10-14>"),
    type: ["123123123"],
    name: "Star Wars",
    casts: ["Mark Hamill", "Harrison Ford"],
    director: "eorge Lucas",
    introduce:
      "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
  };
  const movie5 = {
    IMDBid: "123123123",
    rate: 9.0,
    date: new Date("<1957-10-14>"),
    type: ["123123123"],
    name: "12 Angry Men",
    casts: ["Martin Balsam", "John Fiedler"],
    director: "Sidney Lumet",
    introduce:
      "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before jumping to a hasty verdict.",
  };
  await movies.insertOne(movie1);
  await movies.insertOne(movie2);
  await movies.insertOne(movie3);
  await movies.insertOne(movie4);
  await movies.insertOne(movie5);

  const comment1 = {
    userId: "123123123",
    movieId: "123123123",
    content: "This the content of the comment",
    parentId: "2131231312",
    date: new Date("<2022-03-11>"),
    likes: 20,
    rate: 3.5,
  };
  await comments.insertOne(comment1);

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
  await type.insertMany(types);
}

main();
