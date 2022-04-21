const express = require("express");
const app = express();
// const session = require("express-session");
const routesConstructor = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");

app.use(express.json());

// app.use(
//   session({
//     name: "AuthCookie",
//     secret: "some secret string!",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

routesConstructor(app);

app.listen(3000, () => {
  console.log("Your routes will be running on http://localhost:3000");
});
