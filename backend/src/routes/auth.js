const express = require("express");

const router = express.Router();

const { signup, signin, signout } = require("../controllers/auth");
const { userSignupValidator, userSigninValidator } = require("../validator/user");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", userSigninValidator, signin);
router.get("/signout", signout);

module.exports = router;
