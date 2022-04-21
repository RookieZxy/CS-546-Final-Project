const mongoCollections = require('../../config/mongoCollections');
const users = mongoCollections.users
const bcryptjs = require('bcrypt');
const axios = require("axios");



async function checkUser(account, password) {
    account = account.trim();
    if(!account || !password)
        throw `account and password should not be empty!`
    if(account.length == 0)
        throw `account shouldn't be empty spaces`;
    if (typeof username !== 'string')
        throw `${username} is not a string`
    if(account.length < 4 || account.length > 16)
        throw `account should be at least 4 characters and do not more than 16`;
    
    password = password.trim();
    if (typeof username !== 'string')
        throw `${username} is not a string`
    if(password.length == 0)
        throw `password shouldn't be empty spaces`;
    if(password.length < 8 || password.length > 16)
        throw `password should be at least 8 characters and do not more than 16`;
    
    // let hasPwd = bcryptjs.hashSync(password, 10);
    const userCollection = await getAllUser();

    let userInfo = await userCollection.findOne({account: account});
    if(userInfo == null)
        throw `account is not existed`;
    if (!await bcryptjs.compare(password, userInfo.password))
        throw `password is not correct`;

    return {
        authenticated: true
    }
}
async function getAllUser(){
    try {
        const { data } = await axios.get(
            `../../task/seed`
        );
        return data;
    } catch (error) {
        return error;
    }
}

module.exports = {
    //createUser,
    checkUser
}