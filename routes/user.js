'use strict';
const express = require("express");
const router = express.Router();

const {signup, signin} = require("../controllers/user");
const {userSignupValidator, userSigninValidator} = require("../validator");

router.post('/signup', userSignupValidator, signup);
router.post('/signin', userSigninValidator, signin);


module.exports = router;