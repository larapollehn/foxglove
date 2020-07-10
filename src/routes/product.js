const express = require("express");

const router = express.Router();

const { create, productById } = require("../controllers/product");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { createProduct } = require("../validator/product");

router.post("/product/create/:userId", createProduct, requireSignin, isAuth, isAdmin, create);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
