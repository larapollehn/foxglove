const express = require("express");

const router = express.Router();

const { create, productById, read, removeProduct, updateProduct } = require("../controllers/product");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { validateProduct } = require("../validator/product");

router.get("/product/:productId", read);
router.post("/product/create/:userId",  create);
router.delete("/product/:productId/:userId", removeProduct);
router.put("/product/:productId/:userId", updateProduct);


router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
