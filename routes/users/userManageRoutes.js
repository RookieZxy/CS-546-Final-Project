const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;
const util = require('../../data');
const utilsData = util.utils;
const bcryptjs = require('bcrypt');
const xss = require("xss");

router.get("/", async (req, res) => {
  if (req.session.user == undefined) {
    res.redirect("/login");
  } else {
    if (req.session.user.isAdmin == false) {
      res.redirect('/');
    }
    res.render('users/Info', {
      title: 'user manage',
      login_flag: 'login'
    })
  }
});

router.post("/account", async (req, res) => {
  try {
    if (req.session.user == undefined) {
      res.redirect("/login");
    } else {
      if (req.session.user.isAdmin == false) {
        res.redirect('/');
        return;
      }

      req.body.account = xss(req.body.account);
      let users = undefined;
      if (req.body.account.length != 0) {
        users = await usersData.get(req.body.account)
      } else {
        users = await usersData.getAll()
      }
      if (!users)
        throw `account does not exist!`;
      res.status(200).send(users);

    }
  } catch (e) {
    console.log(e);
    // res.status(400).render('users/Info', {
    //   searchInfo: 'fail',
    //   status: 'HTTP 400',
    //   error: e
    // })
    res.status(500).send({
      error: e
    });
  }
});

router.post('/add', async (req, res) => {
  try {
    if (req.session.user == undefined) {
      res.redirect("/login");
    } else {
      if (req.session.user.isAdmin == false) {
        res.redirect('/');
      }
      if (!req.body || !req.body.account || !req.body.password || !req.body.firstName || !req.body.lastName)
        throw 'Missing username or password'

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
      res.status(200).send({
        addInfo: 'success'
      });
    }
  } catch (e) {
    console.log(e);
    // res.status(400).render('users/Info', {
    //   addInfo: 'fail',
    //   status: 'HTTP 400',
    //   error: e
    // })
    res.status(500).send({
      error: e
    });
  }
});

router.post('/update', async (req, res) => {

  let updatedData = await usersData.get(req.body.account);
  try {
    if (req.session.user == undefined) {
      res.redirect("/login");
    } else {
      if (req.session.user.isAdmin == false) {
        res.redirect('/');
      }
      if (!req.body.lastName && !req.body.firstName)
        throw 'Missing Information';

      req.body.firstName = xss(req.body.firstName);
      req.body.lastName = xss(req.body.lastName);

      if (req.body.firstName)
        updatedData[0].firstName = req.body.firstName;
      if (req.body.lastName)
        updatedData[0].lastName = req.body.lastName;

      utilsData.checkString('firstName', updatedData[0].firstName);
      utilsData.checkString('lastName', updatedData[0].lastName);

      // console.log(updatedData[0].password, updatedData[0].isAdmin, updatedData[0].firstName, updatedData[0].lastName)
      const updatedUsers = await usersData.changeName(req.body.account, updatedData[0].password, updatedData[0].isAdmin, updatedData[0].firstName, updatedData[0].lastName);
      if (updatedUsers) {
        res.status(200).send({})
      } else
        res.status(500).send({
          error: 'Internal Server Error'
        })
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({
      error: e,
    })
  }
});

router.post('/password', async (req, res) => {
  try {
    if (req.session.user == undefined) {
      res.redirect("/login");
    } else {
      if (req.session.user.isAdmin == false) {
        res.redirect('/');
      }
      if (!req.body.account)
        throw 'Missing account';
      if (!req.body.password)
        throw 'Missing password';

      req.body.password = xss(req.body.password);
      req.body.account = xss(req.body.account);

      utilsData.checkString('account', req.body.account);
      utilsData.checkString('password', req.body.password);
      utilsData.checkPassword(password);

      let updatedData = await usersData.get(req.body.account);
      updatedData[0].password = req.body.password;

      // console.log(updatedData[0].password, updatedData[0].isAdmin, updatedData[0].firstName, updatedData[0].lastName)
      const updatedUsers = await usersData.update(req.body.account, updatedData[0].password, updatedData[0].firstName, updatedData[0].lastName);
      if (updatedUsers) {
        res.status(200).send({})
      } else
        res.status(500).send({
          error: 'Internal Server Error'
        })
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({
      error: e,
    })
  }
});

router.post('/admin', async (req, res) => {
  try {
    if (req.session.user == undefined) {
      res.redirect("/login");
    } else {
      if (req.session.user.isAdmin == false) {
        res.redirect('/');
      }
      if (!req.body.account)
        throw 'Missing account';
      if (!req.body.isAdmin)
        throw 'Missing isAdmin';
      req.body.isAdmin = xss(req.body.isAdmin);
      req.body.account = xss(req.body.account);
      // console.log(req.body.isAdmin)
      let isAdmin = true;
      if (req.body.isAdmin == 'true')
        isAdmin = true;
      else if (req.body.isAdmin == 'false')
        isAdmin = false;

      if (typeof isAdmin !== 'boolean')
        throw `isAdmin must be true or false`
      utilsData.checkString('account', req.body.account);

      let updatedData = await usersData.get(req.body.account);
      updatedData[0].isAdmin = isAdmin;

      const updatedUsers = await usersData.changeAdmin(req.body.account, updatedData[0].isAdmin);
      if (updatedUsers) {
        res.status(200).send({})
      } else
        res.status(500).send({
          error: 'Internal Server Error'
        })
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({
      error: e,
    })
  }
})

router.post('/remove', async (req, res) => {
  try {
    if (req.session.user == undefined) {
      res.redirect("/login");
    } else {
      if (req.session.user.isAdmin == false) {
        res.redirect('/');
      }
      if (!req.body.account)
        throw 'Missing username'
      req.body.account = xss(req.body.account);
      utilsData.checkAccount(req.body.account);


      const newUser = await usersData.remove(req.body.account);

      // console.log(newUser);
      if (newUser.userDeleted == true)
        res.send({
          removeInfo: 'success'
        });
      else
        res.status(500).send({
          error: 'Internal Server Error'
        })
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({
      error: e
    })
  }
});

module.exports = router;