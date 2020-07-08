'use strict';
const User = require("../models/user");
const log = require("../utils/Logger");
/**
 * find user based on id of current user
 * return user if found
 */
exports.userById = (req, res, next, id) => {
    log.debug('User was searched by id:', id);
    User.findById(id).exec((err, user) => {
        if (err || !user){
            return res.status(400).json({error: "User not found"});
        }
        req.profile = user;
        next();
    })
}