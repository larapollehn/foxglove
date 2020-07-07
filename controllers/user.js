'use strict';
const User = require("../models/user");

exports.signUp = (req, res) => {
    console.log("req.body:", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if(err){
            return res.status(400).json({err});
        }
        res.json({user});
    })
};