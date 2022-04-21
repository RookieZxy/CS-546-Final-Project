const movieRoutes = require("./movieRoutes");
const loginRoutes = require('./loginRoutes');
const signupRoutes = require('./signupRoutes');
const path = require('path');

const constructorMethod = (app) => {
  app.set('views', path.join(__dirname, '../views'));
  // app.use("/", (req, res) => {
  //   res.send("welcome");
  // });
  app.use("/movie", movieRoutes);
  // app.use("*", (req, res) => {
  //   res.redirect("/");
  // });

  app.get('/', (req, res) => {
    // if(req.session.user){
    //   return res.redirect('/home');
    // }
    res.render('users/login', {document_title: 'login'});
  })

  //login
  app.use('/login', loginRoutes);
  app.use('/signup', signupRoutes);
};

module.exports = constructorMethod;
