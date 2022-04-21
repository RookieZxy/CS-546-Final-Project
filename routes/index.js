const movieRoutes = require("./movieRoutes");

const constructorMethod = (app) => {
  // app.use("/", (req, res) => {
  //   res.send("welcome");
  // });
  app.use("/movie", movieRoutes);
  // app.use("*", (req, res) => {
  //   res.redirect("/");
  // });
};

module.exports = constructorMethod;
