const express = require("express");

const router = express.Router();

const {
 create, listAllProducts, productById, read, removeProduct, searchByUserInput, updateProduct, getProductPhoto, getRelatedProducts, listBySearch, listProductCategories,
} = require("../controllers/product");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { validateProduct } = require("../validator/product");

router.get("/product/:productId", read);
router.get("/products/listAll", listAllProducts);
router.get("/product/related/:productId", getRelatedProducts);
router.get("/products/categories", listProductCategories);
router.get("/product/photo/:productId", getProductPhoto);
router.post("/product/create/:userId", create);
router.post("/product/by/search", listBySearch);
router.post("/products/search", searchByUserInput);
router.delete("/product/:productId/:userId", removeProduct);
router.put("/product/:productId/:userId", updateProduct);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
