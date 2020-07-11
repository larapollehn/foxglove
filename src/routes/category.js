const express = require("express");

const router = express.Router();

const { create, categoryById, getCategory } = require("../controllers/category");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.get("/category/:categoryId", getCategory);
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);

router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;
