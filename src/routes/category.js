"use strict";
const express = require("express");
const router = express.Router();

const { create } = require("../controllers/category");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);

router.param("userId", userById);

module.exports = router;
