const movieRoutes = require("./movieRoutes");
const loginRoutes = require('./users/loginRoutes');
const signupRoutes = require('./users/signupRoutes');
const homeRoutes = require('./homeRoutes');
const usersRoutes = require('./users/usersRoutes');
const forgotRoutes = require('./users/forgotRoutes');
const userManageRoutes = require('./users/userManageRoutes');
const commentRoutes = require('./commentRoutes');
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

  // app.get('/', (req, res) => {
  //   if(req.session.user){
  //     return res.redirect('/home');
  //   }
  //   res.render('users/login', {document_title: 'home'});
  // })

  //log out
  app.get('/logout', async (req, res) => {
    req.session.destroy();
    res.clearCookie('AuthCookie');
    res.redirect('/');
    // res.render('home/home', {login_flag: 'logout'});
  });

  // app.get('/login2', async (req, res) => {
  //   req.session.destroy();
  //   res.clearCookie('AuthCookie');
  //   res.render('users/login', {login_flag: 'logout'});
  // });
  
  //login
  app.use('/login', loginRoutes);
  //home page
  app.use('/', homeRoutes);
  //sign up
  app.use('/signup', signupRoutes);
  //get information
  app.use('/users', usersRoutes);
  //forgot password
  app.use('/forgot', forgotRoutes);
  //user manage
  app.use('/userManage', userManageRoutes);
  //comment
  app.use('/comment', commentRoutes);
};

module.exports = constructorMethod;
