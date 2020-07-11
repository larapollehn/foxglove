const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const log = require("../utils/Logger");

/**
 * create new product based on input form data
 * @param req
 * @param res
 */
exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400)
        .json({ error: err.message });
    }
    const product = new Product(fields);
    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((error, result) => {
      if (error) {
        return res.status(400)
          .json({ error: error.message });
      }
      return res.json({ result });
    });
  });
};

/**
 * fetches product from db based on product id
 * @param req
 * @param res
 * @param next
 * @param id from product
 */
exports.productById = (req, res, next, id) => {
  log.debug("product was requested:", id);
  Product.findById(id)
    .exec((error, product) => {
      if (error || !product) {
        return res.status(400)
          .json({ error: "Product not found" });
      }
      req.product = product;
      next();
    });
};

/**
 * returns the requested product based on the product id in params
 */
exports.read = (req, res) => {
  req.product.photo = undefined; // set to undefined because it is not needed for this operation and file size could be huge
  return res.json(req.product);
};

/**
 * remove product
 * @param req
 * @param res
 */
exports.removeProduct = (req, res) => {
  const product = req.product;
  log.debug("product was requested to be deleted", product.id);
  product.remove((err, deleteProduct) => {
    if (err) {
      return res.status(400)
        .send("Product could not be deleted");
    }
    res.json({
      deleteProduct,
      message: "Product deleted successfully"
    });
  });
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400)
        .json({ error: err.message });
    }
    let product = req.product;
    product = _.extend(product, fields);
    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((error, result) => {
      if (error) {
        return res.status(400)
          .json({ error: error.message });
      }
      return res.json({ result });
    });
  });
};

/**
 * finds products based on the requested products category
 * and returns product with same category
 * @param req
 * @param res
 */
exports.getRelatedProducts = (req, res) => {
  log.debug("Related proucts were requested");
  let limit = req.query.limit ? parseInt(req.query.limit) : 3;
  Product.find({
    _id: { $ne: req.product },
    category: req.product.category
  })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(400)
          .json({ error: "Products found" });
      }
      log.debug("Related products were found, amount:", products.length);
      return res.json({ products });
    });
};

exports.listProductCategories = (req, res) => {
  log.debug("List of all product categories was requested");
  Product.distinct("category", {}, (err, productCategories) => {
    if (err) {
      return res.status(400)
        .json({
          error: "No product catgories found"
        });
    }
    res.json({ productCategories });
  });
};
