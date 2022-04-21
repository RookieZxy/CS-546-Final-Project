const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;

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
    // if (req.session.user) {
    //     return res.redirect('/private');
    // }
    res.render('users/signup', {
        login_flag: 'signup'
    })
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body.account);
        console.log(req.body.confirm);
        console.log(req.body.password);
        if (!req.body || !req.body.account || !req.body.confirm|| !req.body.password || !req.body.firstname || !req.body.lastname)
            throw 'Missing username or password'
        if (!req.body.password != !req.body.confirm)
            throw `The two passwords are inconsistent`;
        checkAccount(req.body.account);
        checkPassword(req.body.password);
        checkName(req.body.firstname, req.body.lastname)


        const newUser = await usersData.createUser(
            req.body.account,
            req.body.password,
            req.body.firstname,
            rea.body.lastname,
        );

        if (newUser.userInserted == true)
            res.redirect('/users/login');
        else
            res.status(500).send({
                message: 'Internal Server Error'
            })
    } catch (e) {
        res.status(400).render('users/signup', {
            login_flag: 'signup',
            status: 'HTTP 400',
            error: e
        })
    }
});

module.exports = router;