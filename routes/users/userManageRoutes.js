const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;

router.get("/", async (req, res) => {
  res.render('users/Info', {
    login_flag: 'login'
  })
});

router.post("/account", async (req, res) => {
  try {
    console.log(req.body.account);
    const users = await usersData.get(req.body.account)
    if (!users)
      throw `account does not exist!`;
    res.render("users/Info", {
      user: users,

    });
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});

router.post('/add', async (req, res) => {
  try {
      if (!req.body || !req.body.account || !req.body.confirm|| !req.body.password || !req.body.firstname || !req.body.lastname)
          throw 'Missing username or password'
      if (req.body.password != req.body.confirm)
          throw `The two passwords are inconsistent`;

      checkAccount(req.body.account);
      checkPassword(req.body.password);
      checkName(req.body.firstname, req.body.lastname)


      const newUser = await usersData.createUser(
          req.body.account,
          req.body.password,
          req.body.firstname,
          req.body.lastname,
      );

      // console.log(newUser);
      if (newUser.userInserted == true)
          res.redirect('/login');
      else
          res.status(500).send({
              message: 'Internal Server Error'
          })
  } catch (e) {
      console.log(e);
      res.status(400).render('users/signup', {
          login_flag: 'signup',
          status: 'HTTP 400',
          error: e
      })
  }
});

module.exports = router;