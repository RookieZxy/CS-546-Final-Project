const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;

router.get("/", async (req, res) => {
  try {
    const users = await usersData.get(req.session.user.account)
    if(!users)
      throw`account does not exist!`
    console.log(users);
    res.render('users/account', {user: users})
  } catch (e) {
    console.log(e);
    res.status(400).render('users', {
      login_flag: 'users',
      status: 'HTTP 400',
      error: e
    })
  }
  // const users = await usersData.get(req.session.user.account)
  // console.log(users);
  // res.render('users/account', users)

});
module.exports = router;