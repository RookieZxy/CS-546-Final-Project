const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;
const xss = require("xss");

function checkName(account) {
    account = account.trim();
    if (typeof account !== 'string')
        throw `${account} is not a string`;
    if (account.length < 4)
        throw 'account should be at least 4 characters and not be empty spaces';
    if (account.length > 16)
        throw 'The length of account should not be more than 16';
    if (account.indexOf(" ") != -1)
        throw 'account should not have spaces';
    var Regx = /^[A-Za-z0-9]*$/;
    if (!Regx.test(account))
        throw 'account should only be combained by alphanumeric characters';
}

function checkPassword(p) {
    password = p.trim();
    if (typeof password !== 'string')
        throw `${password} is not a string`
    if (password.indexOf(" ") != -1)
        throw 'password should not have spaces'
    if (password.length < 6)
        throw 'password should not be empty spaces and should be at least 6 characters'
    if (password.length > 16)
        throw 'The length of password should not be more than 16'
}

router.get('/', async (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('users/login', {title: 'login'})
});


router.post('/', async (req, res) => {
    try {
        if (!req.body || !req.body.account || !req.body.password)
            throw 'Missing account or password'
        // req.body.account = req.body.account.toLowerCase();
        req.body.account = xss(req.body.account);
        req.body.password = xss(req.body.password);
        checkName(req.body.account);
        checkPassword(req.body.password);
        const newUser = await usersData.checkUser(
            req.body.account,
            req.body.password
        );
        if (newUser.authenticated == true) {
            // console.log(req.body.account);
            const temp = await usersData.get(req.body.account);
            // console.log(temp[0].isAdmin);
            req.session.user = {
                account: req.body.account,
                isAdmin: temp[0].isAdmin
            };
            res.status(200).send();
        }
    } catch (e) {
        console.log(e);
        // res.status(400).render('users/login', {
        //     login_flag: 'login',
        //     status: 'HTTP 400',
        //     error: e
        // })
        res.status(500).send({
            error: e
        });
    }
});

module.exports = router;