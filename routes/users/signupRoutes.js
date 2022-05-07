const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;
const xss = require("xss");

function checkAccount(username) {
    username = username.trim();
    if (typeof username !== 'string')
        throw `${username} is not a string`
    if (username.length < 4)
        throw `username shouldn't be empty spaces and it'length should be at least 4 characters`;
    if (username.length > 16)
        throw `The length of username shouldn't be more than 16`;
    if (username.indexOf(" ") != -1)
        throw `username shouln'd have spaces`
    var Regx = /^[A-Za-z0-9]*$/;
    if (!Regx.test(username))
        throw 'username should only be combained by alphanumeric characters'
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

function checkName(firstName, lastName) {
    if (typeof firstName !== 'string' || typeof lastName !== 'string')
        throw `firstName and lastName should be string`;
    firstName = firstName.trim();
    lastName = lastName.trim();
    if (firstName.length == 0 || lastName.length == 0)
        throw `firstName and lastName should not be empty spaces`;
}


router.get('/', async (req, res) => {
    res.render('users/signup', {title: 'sign up'})
});

router.post('/', async (req, res) => {
    try {
        if (!req.body || !req.body.account || !req.body.confirm || !req.body.password || !req.body.firstname || !req.body.lastname)
            throw 'Missing username or password'
        if (req.body.password != req.body.confirm)
            throw `The two passwords are inconsistent`;
        req.body.account = xss(req.body.account);
        req.body.password = xss(req.body.password);
        req.body.firstname = xss(req.body.firstname);
        req.body.lastname = xss(req.body.lastname);
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
            // res.redirect('/login');
            res.status(200).send();
        // else
        //     res.status(500).send({
        //         message: 'Internal Server Error'
        //     })
    } catch (e) {
        console.log(e);
        // res.status(400).render('users/signup', {
        //     login_flag: 'signup',
        //     status: 'HTTP 400',
        //     error: e
        // })
        res.status(500).send({
            error: e
        });
    }
});

module.exports = router;