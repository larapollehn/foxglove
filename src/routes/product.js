const express = require("express");

const router = express.Router();

const { create, productById, read, removeProduct } = require("../controllers/product");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { createProduct } = require("../validator/product");

router.get("/product/:productId", read);
router.post("/product/create/:userId", createProduct, requireSignin, isAuth, isAdmin, create);
router.delete("/product/:productId/:userId", removeProduct);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
