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

router.get('/', async (req, res) => {
    res.render('users/forgotPassword', {
        title: 'forgotPassword',
        login_flag: 'forgot'
    })
});

router.post("/", async (req, res) => {
    let updatedData = await usersData.get(req.body.account);
    try {
        if (!req.body.confirmPw || !req.body.password || !req.body.prepassword)
            throw 'Missing Information';
        if (req.body.confirmPw != req.body.password)
            throw `The inputed two passwords are inconsistent`;

        checkPassword(req.body.prepassword);
        checkPassword(req.body.password);
        checkPassword(req.body.confirmPw);
        checkString('prepassword', req.body.prepassword);
        checkString('password', req.body.password);
        checkString('confirmPw', req.body.confirmPw);

        if (!await bcryptjs.compare(req.body.prepassword, updatedData.password))
            throw `Previous password is not correct`;
        updatedData.password = req.body.password;

        const updatedUsers = await usersData.update(req.body.account, updatedData.password, updatedData.firstName, updatedData.lastName);
        // console.log(updatedUsers);
        if (updatedUsers)
            res.redirect('/login');
        else
            res.status(500).send({
                message: 'Internal Server Error'
            })
        // res.render('users/account', {
        //   user: updatedUsers
        // })
    } catch (e) {
        console.log(e);
        res.status(400).render('users/forgotPassword', {
            login_flag: 'users',
            status: 'HTTP 400',
            error: e
        })
    }
});

module.exports = router;