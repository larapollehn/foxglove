'use strict';
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");

const Auth = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET || "ifdjsaihidshgo";

exports.signup = (req, res) => {
    const user = new Auth(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({error: err.message});
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({user});
    })
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    Auth.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Auth with that email does not exist. Please signup'
            });
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            });
        }
        // create and sign jwt, payload is userId
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        res.cookie('t', token, { expire: new Date() + 9999 });
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.requireSignin = expressJWT({
    secret: JWT_SECRET,
    algorithms: ["HS256"]

});

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({message: "Auth signed out"});
}