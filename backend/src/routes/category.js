const express = require("express");

const router = express.Router();

const {
 create, categoryById, getCategory, updateCategory, removeCategory, listAllCategories,
} = require("../controllers/category");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

router.get("/category/:categoryId", getCategory);
router.get("/category", listAllCategories);
router.post("/category/create/:userId", create);
router.put("/category/:userId/:categoryId", updateCategory);
router.delete("/category/:userId/:categoryId", removeCategory);

router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;
