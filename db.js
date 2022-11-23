"use strict";

const path = require("path");
const { Sequelize, Model, DataTypes, ValidationError } = require("sequelize");

exports.sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "db.sqlite"),
});

exports.User = class User extends Model {};

exports.User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: exports.sequelize,
  }
);

exports.Message = class Message extends Model {};

exports.Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: exports.sequelize,
  }
);

exports.ValidationError = ValidationError;
