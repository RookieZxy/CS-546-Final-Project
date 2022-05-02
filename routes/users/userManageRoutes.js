const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;
const util = require('../../data');
const utilsData = util.utils;
const xss = require("xss");

router.get("/", async (req, res) => {
  res.render('users/Info', {
    login_flag: 'login'
  })
});

router.post("/account", async (req, res) => {
  try {
    req.body.account = xss(req.body.account);
    let users = undefined;
    if(req.body.account.length != 0){
      users = await usersData.get(req.body.account)
    }else{
      users = await usersData.getAll()
    }
    if (!users)
      throw `account does not exist!`;
    // res.render("users/Info", {
    //   user: users,

    // });
    res.status(200).send(users);
  } catch (e) {
    console.log(e);
    // res.status(400).render('users/Info', {
    //   searchInfo: 'fail',
    //   status: 'HTTP 400',
    //   error: e
    // })
    res.status(500).send({error:e});
  }
});

router.post('/add', async (req, res) => {
  try {
    if (!req.body || !req.body.account || !req.body.confirm || !req.body.password || !req.body.firstName || !req.body.lastName)
      throw 'Missing username or password'
    if (req.body.password != req.body.confirm)
      throw `The two passwords are inconsistent`;
    
    req.body.account = xss(req.body.account);
    req.body.password = xss(req.body.password);
    req.body.firstName = xss(req.body.firstName);
    req.body.lastName = xss(req.body.lastName);
    utilsData.checkAccount(req.body.account);
    utilsData.checkPassword(req.body.password);
    utilsData.checkName(req.body.firstName, req.body.lastName);


    const newUser = await usersData.createUser(
      req.body.account,
      req.body.password,
      req.body.firstName,
      req.body.lastName,
    );

    // console.log(newUser);
    // if (newUser.userInserted == true)
    //   res.render('users/Info', {
    //     addInfo: 'success'
    //   });
    // else
    //   res.status(500).send({
    //     message: 'Internal Server Error'
    //   })
    res.status(200).send({addInfo: 'success'});
  } catch (e) {
    console.log(e);
    // res.status(400).render('users/Info', {
    //   addInfo: 'fail',
    //   status: 'HTTP 400',
    //   error: e
    // })
    res.status(500).send({error:e});
  }
});

router.post('/update', async (req, res) => {
  let updatedData = await usersData.get(req.body.account);
  try {
    if (!req.body.password && !req.body.lastName && !req.body.firstName)
      throw 'Missing Information';
    if (req.body.password)
      updatedData.password = req.body.password;
    if (req.body.firstName)
      updatedData.firstName = req.body.firstName;
    if (req.body.lastName)
      updatedData.lastName = req.body.lastName;


    utilsData.checkPassword(updatedData.password);
    utilsData.checkString('password', updatedData.password);
    utilsData.checkString('firstName', updatedData.firstName);
    utilsData.checkString('lastName', updatedData.lastName);

    const updatedUsers = await usersData.update(req.body.account, updatedData.password, updatedData.firstName, updatedData.lastName);
    // console.log(updatedUsers);
    if (updatedUsers) {
      // res.redirect('/users');
      res.status(400).render('users/Info', {
        updateInfo: 'success',
        user: updatedUsers
      })
    } else
      res.status(500).send({
        message: 'Internal Server Error'
      })
    // res.render('users/account', {
    //   user: updatedUsers
    // })
  } catch (e) {
    console.log(e);
    res.status(400).render('users/Info', {
      updateInfo: 'fail',
      status: 'HTTP 400',
      error: e
    })
  }
});

router.post('/remove', async (req, res) => {
  try {
    if (!req.body.account)
      throw 'Missing username'

    utilsData.checkAccount(req.body.account);


    const newUser = await usersData.remove(req.body.account);

    // console.log(newUser);
    if (newUser.userDeleted == true)
      res.render('users/Info', {
        removeInfo: 'success'
      });
    else
      res.status(500).send({
        message: 'Internal Server Error'
      })
  } catch (e) {
    console.log(e);
    res.status(400).render('users/Info', {
      removeInfo: 'fail',
      status: 'HTTP 400',
      error: e
    })
  }
});

module.exports = router;