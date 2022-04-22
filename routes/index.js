const movieRoutes = require("./movieRoutes");
const loginRoutes = require('./loginRoutes');
const signupRoutes = require('./signupRoutes');
const homeRoutes = require('./homeRoutes');
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
    if(req.session.user){
      return res.redirect('/home');
    }
    res.render('home/home', {document_title: 'home'});
  })

  //log out
  app.get('/logout', async (req, res) => {
    req.session.destroy();
    res.clearCookie('AuthCookie');
    res.render('home/home', {login_flag: 'logout'});
  });
  
  //login
  app.use('/login', loginRoutes);
  //home page
  app.use('/home', homeRoutes);
  //sign up
  app.use('/signup', signupRoutes);
};

module.exports = constructorMethod;
