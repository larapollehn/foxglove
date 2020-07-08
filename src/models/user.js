"use strict";
const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    about: {
      type: String,
      trim: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    history: {
      type: Array,
      default: []
    }
  }, { timestamps: true }
);

// virtual field
// encrypts users password with a randomly generated salt
userSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  // user password is encrypted with sha1 and salt
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto.createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
  // checks is the password from the users input is equal to the password from the user account
  // compares hashed versions of passwords
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password;
  }
};

module.exports = mongoose.model("User", userSchema);
