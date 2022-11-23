"use strict";

require("dotenv").config();

const bcrypt = require("bcryptjs");
const { sequelize, User } = require("./db");

async function createUser(username, password) {
  try {
    await sequelize.sync();

    let salt = await bcrypt.genSalt();
    let hash = await bcrypt.hash(password, salt);

    await User.create({ username, password: hash });
  } catch (err) {
    console.error(err);
  }
}

let username = process.env.USERNAME;
let password = process.env.PASSWORD;

createUser(username, password);
