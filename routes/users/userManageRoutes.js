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
      user: users
    });
  } catch (e) {
    res.status(500).json({
      error: e
    });
  }
});

module.exports = router;