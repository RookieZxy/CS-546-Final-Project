const dbConnection = require("./mongoConnection");

const getConnectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.connectToDb();
      //allow you to have one reference to each collection per app
      _col = await db.collection(collection);
    }
    return _col;
  };
};

module.exports = {
  users: getConnectionFn("users"),
  movies: getConnectionFn("movies"),
  comments: getConnectionFn("comments"),
  type: getConnectionFn("type"),
};
