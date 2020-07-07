'use strict';
const express = require("express");
const router = express.Router();

const {signUp} = require("../controllers/user");

router.post('/signup', signUp);

module.exports = router;