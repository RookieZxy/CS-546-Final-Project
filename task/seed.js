const mongoConnections = require("../config/mongoCollections");
const mongoConnection = require("../config/mongoConnection");
const movieData = require("../data/movie/movie");
const userData = require("../data/users/users");
const commentData = require("../data/movie/comment");
const { ObjectId } = require("mongodb");
const username = [
  "Kaka",
  "Tony",
  "Bale",
  "Zhou",
  "XiangXiang",
  "Papa",
  "Lala",
  "NiuNiu",
  "Mike",
  "Suku",
];
const commentContant = [
  "Ordinary standards will not serve for Citizen Kane; extravagance of idea for serious ends is not common enough in the cinema to provide a yardstick.",
  "[It] is my opinion that Mr. Welles has been sympathetic and kind. He reveals great respect for people, and a knowledge of their powers and talents.",
  "I would say it is a great picture but... It is one of those things, like the Pyramids, which are impressive and definitely interesting to have seen, but one can have more fun than looking at the Pyramids.",
  "A distinctly out-of-the-rut production and a great piece of cinema artistry.",
  "Orson Welles, who plays Kane, produces and directs, has driven to the heart of his subject with a fierce, thrusting energy that is rare and refreshing.",
  "It is daring, different, thrilling and revolutionary, a power play of startling brilliance.",
  "Welles has grasped the art of the photoplay in a single venture. He has accomplished in one picture what Hollywood veterans have been aiming at tor years.",
  " would say it is a great picture but... It is one of those things, like the Pyramids, which are impressive and definitely interesting to have seen, but one can have more fun than looking at the Pyramids.",
  "has done a remarkable job of producing something different from the ordinary run of film fare, and in doing so has brought a number of new faces to the screen, besides appearing in the title roll himself.",
  "Welles is the most exciting thing that's happened since sound.",
];

var movieSeed = require("../public/json/movies.json");

async function main() {
  const users = await mongoConnections.users();
  const movies = await mongoConnections.movies();
  const comments = await mongoConnections.comments();
  const type = await mongoConnections.type();

  const db = await mongoConnection.connectToDb();
  await db.dropDatabase();

  for (let i = 0; i < movieSeed.length; i++) {
    let movie = movieSeed[i];

    movie.isValid = true;
    delete movie._id;
  }
  await movies.insertMany(movieSeed);

  let movieList = await movies.find().toArray();

  for (let i = 0; i < movieList.length; i++) {
    const movie = movieList[i];
    let id = movie._id.toString();
    let n = Math.ceil(Math.random() * 10);
    for (let j = 0; j < n; j++) {
      let score = Math.ceil(Math.random() * 10);
      await commentData.createComment(
        commentContant[Math.floor(Math.random() * 10)],
        username[Math.floor(Math.random() * 10)],
        id,
        "2022-05-04",
        score
      );
      await commentData.calMovieRate(id);
    }
  }
  //user
  await userData.createAdmin("admin", "123456", "Mike", "Lee");

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

  await type.insertMany(types);

  await mongoConnection.closeConnection();
}

main();
