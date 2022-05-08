const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;
const bcryptjs = require('bcrypt');
const xss = require("xss");

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
    if(req.session.user == undefined)
      throw `Please login first`;
    const users = await usersData.get(req.session.user.account)
    if (!users)
      throw `account does not exist!`
    res.render('users/account', {
      title: 'user info',
      user: users[0]
    })
    // res.render('users/account', users)
  } catch (e) {
    res.redirect("/login");
  }
});

router.post("/password", async (req, res) => {
  if (req.session.user == undefined)
    throw `Please login first`;
  let updatedData = await usersData.get(req.session.user.account);
  updatedData = updatedData[0];
  try {
    if (!req.body.prepassword || !req.body.password || !req.body.confirmPw)
      throw `Missing Information`;
    if (req.body.confirmPw != req.body.password)
      throw `The inputed two passwords are inconsistent`;
    checkPassword(req.body.prepassword);
    checkPassword(req.body.password);
    checkPassword(req.body.confirmPw);
    checkString('prepassword', req.body.prepassword);
    checkString('password', req.body.password);
    checkString('confirmPw', req.body.confirmPw);

    req.body.password = xss(req.body.password);
    req.body.confirmPw = xss(req.body.confirmPw);
    req.body.prepassword = xss(req.body.prepassword);

    if (!await bcryptjs.compare(req.body.prepassword, updatedData.password))
      throw `Previous password is not correct`;
    updatedData.password = req.body.password;

    const updatedUsers = await usersData.update(req.session.user.account, updatedData.password, updatedData.firstName, updatedData.lastName);

    res.status(200).send({
      userInfo: 'success',
      user: updatedUsers
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      error: e
    });
  }
});

router.post("/", async (req, res) => {
  if (req.session.user == undefined)
    throw `Please login first`;
  let updatedData = await usersData.get(req.session.user.account);
  updatedData = updatedData[0]
  try {
    // if (!req.body.password)
    //   throw 'Missing password';

    if (req.body.firstName)
      updatedData.firstName = req.body.firstName;
    if (req.body.lastName)
      updatedData.lastName = req.body.lastName;
    
    // req.body.password = xss(req.body.password);
    updatedData.firstName = xss(updatedData.firstName);
    updatedData.lastName = xss(updatedData.lastName);

    // checkPassword(req.body.password);
    // checkString('password', req.body.password);
    checkString('firstName', updatedData.firstName);
    checkString('lastName', updatedData.lastName);

    // if (!await bcryptjs.compare(req.body.password, updatedData.password))
    //   throw `password is not correct`;
    // updatedData.password = req.body.password;
    const updatedUsers = await usersData.update(req.session.user.account, updatedData.password, updatedData.firstName, updatedData.lastName);

    res.status(200).send({
      userInfo: 'success',
      user: updatedUsers
    })

  } catch (e) {
    console.log(e);
    res.status(400).send({error:e})
  }
});

module.exports = router;