const mongoCollections = require("../../config/mongoCollections");
const users = mongoCollections.users;
const bcryptjs = require("bcrypt");
const util = require("../utils/util");
// const axios = require("axios");
const { hash } = require("bcrypt");

function errorCheck(account, password, firstName, lastName) {
  account = account.trim();
  if (!account || !password) throw `Please input the username and password`;
  if (typeof account !== "string") throw `${account} is not a string`;
  if (account.length < 4)
    throw `username shouldn't be empty spaces and it'length should be at least 4 characters`;
  if (account.length > 16)
    throw `The length of username shouldn't be more than 16`;
  if (account.indexOf(" ") != -1) throw `username shouln'd have spaces`;
  var Regx = /^[A-Za-z0-9]*$/;
  if (!Regx.test(account))
    throw "username should only be combained by alphanumeric characters";

  password = password.trim();
  if (typeof password !== "string") throw `${password} is not a string`;
  if (password.indexOf(" ") != -1) throw `password shouln'd have spaces`;
  if (password.length < 6)
    throw `password shouldn't be empty spaces and should be at least 6 characters`;
  if (password.length > 16)
    throw `password shouldn't be more than 16 characters`;

  if (typeof firstName !== "string" || typeof lastName !== "string")
    throw `firstName and lastName should be string`;
  firstName = firstName.trim();
  lastName = lastName.trim();
  if (firstName.length == 0 || lastName.length == 0)
    throw `firstName and lastName should not be empty spaces`;
}

//create a new account
async function createUser(username, password, firstName, lastName) {
  errorCheck(username, password, firstName, lastName);


  
  // username = username.toLowerCase();
  let hasPwd = await bcryptjs.hash(password, 10);
  const userCollection = await users();

  let check = await userCollection.findOne({
    account: username,
  });
  if (check != null) throw `${username} is existed, please change the username`;

  let newuser = {
    account: username,
    password: hasPwd,
    isAdmin: false,
    firstName: firstName,
    lastName: lastName,
  };

  //console.log(newuser);

  const insertInfo = await userCollection.insertOne(newuser);
  if (insertInfo.insertedCount == 0) throw `Could not add a new user`;
  return {
    userInserted: true,
  };
}

//create a new Admin
async function createAdmin(username, password, firstName, lastName) {
  errorCheck(username, password, firstName, lastName);
  let hasPwd = await bcryptjs.hash(password, 10);
  const userCollection = await users();

  let check = await userCollection.findOne({
    account: username,
  });
  if (check != null) throw `${username} is existed, please change the username`;

  let newuser = {
    account: username,
    password: hasPwd,
    isAdmin: true,
    firstName: firstName,
    lastName: lastName,
  };

  //console.log(newuser);

  const insertInfo = await userCollection.insertOne(newuser);
  if (insertInfo.insertedCount == 0) throw `Could not add a new user`;
  return {
    userInserted: true,
  };
}

//find whether the user is in database
async function checkUser(account, password) {
  account = account.trim();
  if (!account || !password) throw `account and password should not be empty!`;
  if (account.length == 0) throw `account shouldn't be empty spaces`;
  if (typeof account !== "string") throw `${account} is not a string`;
  if (account.length < 4 || account.length > 16)
    throw `account should be at least 4 characters and do not more than 16`;

  password = password.trim();
  if (typeof password !== "string") throw `${password} is not a string`;
  if (password.length == 0) throw `password shouldn't be empty spaces`;
  if (password.length < 6 || password.length > 16)
    throw `password should be at least 6 characters and do not more than 16`;

  const userCollection = await users();

  let userInfo = await userCollection.findOne({
    account: account,
  });
  if (userInfo == null) throw `account is not existed`;
  if (!(await bcryptjs.compare(password, userInfo.password)))
    throw `password is not correct`;

  return {
    authenticated: true,
  };
}

//find the user's information
async function get(account) {
  account = account.trim();
  if (!account) throw `account should not be empty!`;
  if (account.length == 0) throw `account shouldn't be empty spaces`;
  if (typeof account !== "string") throw `${account} is not a string`;
  if (account.length < 4 || account.length > 16)
    throw `account should be at least 4 characters and do not more than 16`;

  const userCollection = await users();
  let userInfo = await userCollection
    .find({
      account: account,
    })
    .toArray();
  userInfo.forEach((element) => {
    element._id = element._id.toString();
  });
  if (userInfo == null) throw `account is not existed`;
  return userInfo;
}

//update the information about user
async function update(account, password, firstName, lastName) {
  const userCollection = await users();
  let userInfo = await userCollection.findOne({
    account: account,
  });

  let updatedUser = {};
  if (userInfo.password == password) {
    util.checkAccount(account);
    util.checkName(firstName, lastName);
    updatedUser = {
      account: account,
      password: password,
      firstName: firstName,
      lastName: lastName,
    };
  } else {
    errorCheck(account, password, firstName, lastName);

    let hasPwd = await bcryptjs.hash(password, 10);
    updatedUser = {
      account: account,
      password: hasPwd,
      firstName: firstName,
      lastName: lastName,
    };
  }

  const updatedInfo = await userCollection.updateOne(
    {
      account: account,
    },
    {
      $set: updatedUser,
    }
  );

  if (updatedInfo.modifiedCount === 0)
    throw `could not update user successfully`;

  return updatedUser;
}

//update user name
async function changeName(account, password, isAdmin, firstName, lastName) {
  util.checkAccount(account);
  util.checkName(firstName, lastName);

  const userCollection = await users();

  const updatedUser = {
    account: account,
    password: password,
    isAdmin: isAdmin,
    firstName: firstName,
    lastName: lastName,
  };

  const updatedInfo = await userCollection.updateOne(
    {
      account: account,
    },
    {
      $set: updatedUser,
    }
  );

  if (updatedInfo.modifiedCount === 0) throw `Please change Name`;

  return updatedUser;
}

async function changeAdmin(account, isAdmin) {
  util.checkAccount(account);
  if (typeof isAdmin !== "boolean") throw `isAdmin must be true or false`;
  const userCollection = await users();

  const updatedUser = {
    account: account,
    isAdmin: isAdmin,
  };

  const updatedInfo = await userCollection.updateOne(
    {
      account: account,
    },
    {
      $set: updatedUser,
    }
  );

  if (updatedInfo.modifiedCount === 0) throw `Please make a change`;

  return updatedUser;
}

//delete user
async function remove(account) {
  if (!account) throw `Please input the username`;
  account = account.trim();
  if (account.length <= 0) throw `Inputed account is an empty spaces`;

  const userCollection = await users();
  let userInfo = await userCollection.findOne({
    account: account,
  });
  if (userInfo == null) throw `account is not existed`;

  const deletionInfo = await userCollection.deleteOne({
    account: account,
  });

  if (deletionInfo.deletedCount === 0) throw `Could not delete band`;
  return {
    userDeleted: true,
  };
}

// get all users
async function getAll() {
  const userCollection = await users();

  const userList = await userCollection.find({}).toArray();

  userList.forEach((element) => {
    element._id = element._id.toString();
  });

  return userList;
}

module.exports = {
  get,
  update,
  createUser,
  checkUser,
  remove,
  getAll,
  changeName,
  changeAdmin,
  createAdmin,
};
