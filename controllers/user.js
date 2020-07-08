'use strict';
const User = require("../models/user");

exports.signUp = (req, res) => {
    console.log("req.body:", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if(err){
            return res.status(400).send(err.message);
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({user});
    })
};