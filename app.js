const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const routesConstructor = require("./routes");
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");

app.use(express.json());
app.use(cookieParser());
// app.use(
//   session({
//     name: "AuthCookie",
//     secret: "some secret string!",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

app.use("/public", static);
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/home", (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).render("home/home", { login_flag: "unlogin" });
  } else {
    next();
  }
});

app.use(async (req, res, next) => {
  let authenticated = "";
  if (req.session.user) authenticated = "Authenticated User";
  else authenticated = "Non-Authenticated User";
  console.log(
    new Date().toUTCString(),
    req.method,
    req.originalUrl,
    authenticated
  );
  next();
});

routesConstructor(app);
app.listen(3000, () => {
  console.log("Your routes will be running on http://localhost:3000");
});
