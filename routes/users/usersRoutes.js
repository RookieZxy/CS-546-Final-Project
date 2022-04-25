const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;

function checkString(name, str) {
  if (typeof str != 'string')
    throw `${name} is not a string`
  str = str.trim();
  if (str.length <= 0)
    throw `${name} is an empty string`
}

function checkPassword(password) {
  if (typeof password !== 'string')
    throw `${password} is not a string`
  if (password.indexOf(" ") != -1)
    throw `password shouln'd have spaces`
  if (password.length < 6)
    throw `password shouldn't be empty spaces and should be at least 6 characters`
  if (password.length > 16)
    throw `password shouldn't be more than 16 characters`
}



router.get("/", async (req, res) => {
  try {
    const users = await usersData.get(req.session.user.account)
    if (!users)
      throw `account does not exist!`
    res.render('users/account', {
      user: users
    })
  } catch (e) {
    console.log(e);
    res.status(400).render('users', {
      login_flag: 'users',
      status: 'HTTP 400',
      error: e
    })
  }


  router.post("/", async (req, res) => {
    let updatedData = await usersData.get(req.session.user.account);
    try {
      if (!req.body.confirmPw && !req.body.password && !req.body.firstName && !req.body.lastName)
        throw 'Missing Information';
      if (req.body.password){
        if(updatedData.password == req.body.password)
          throw`Please input a different password`;
        updatedData.password = req.body.password;
      }
      if (req.body.firstName)
        updatedData.firstName = req.body.firstName;
      if (req.body.lastName)
        updatedData.lastName = req.body.lastName;

      checkPassword(updatedData.password);
      checkPassword(req.body.confirmPw);
      checkString('password', updatedData.password);
      checkString('confirmPw', req.body.confirmPw);
      checkString('firstName', updatedData.firstName);
      checkString('lastName', updatedData.lastName);
      if (req.body.confirmPw != updatedData.password)
        throw `The inputed two passwords are inconsistent`;

      const updatedUsers = await usersData.update(req.session.user.account, updatedData.password, updatedData.firstName, updatedData.lastName);
      console.log(updatedUsers);
      if (updatedUsers)
        res.redirect('/users');
      else
        res.status(500).send({
          message: 'Internal Server Error'
        })
      // res.render('users/account', {
      //   user: updatedUsers
      // })
    } catch (e) {
      console.log(e);
      res.status(400).render('users/account', {
        login_flag: 'users',
        status: 'HTTP 400',
        error: e
      })
    }
  });

});
module.exports = router;