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
                .json({error: err.message});
        }
        const product = new Product(fields);
        if (files.photo) {
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((error, result) => {
            if (error) {
                return res.status(400)
                    .json({error: error.message});
            }
            return res.json({result});
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
                    .json({error: "Product not found"});
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
 * remove product completely (from website and database)
 * @param req
 * @param res
 */
exports.removeProduct = (req, res) => {
    const {product} = req;
    log.debug("product was requested to be deleted", product.id);
    product.remove((err, deleteProduct) => {
        if (err) {
            return res.status(400)
                .send("Product could not be deleted");
        }
        res.json({
            deleteProduct,
            message: "Product deleted successfully",
        });
    });
};

/**
 * admin can change product details based
 * @param req
 * @param res
 */
exports.updateProduct = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400)
                .json({error: err.message});
        }
        let {product} = req;
        product = _.extend(product, fields);
        if (files.photo) {
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((error, result) => {
            if (error) {
                return res.status(400)
                    .json({error: error.message});
            }
            return res.json({result});
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
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    Product.find({
        _id: {$ne: req.product},
        category: req.product.category,
    })
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, products) => {
            if (err) {
                return res.status(400)
                    .json({error: "Products found"});
            }
            log.debug("Related products were found, amount:", products.length);
            return res.json({products});
        });
};

exports.listProductCategories = (req, res) => {
    log.debug("List of all product categories was requested");
    Product.distinct("category", {}, (err, productCategories) => {
        if (err) {
            return res.status(400)
                .json({
                    error: "No product catgories found",
                });
        }
        res.json({productCategories});
    });
};

/**
 * search product requested by search in frontend
 * using filters like price range, order and amount of products to be displayed
 * @param req
 * @param res
 */
exports.listBySearch = (req, res) => {
    log.debug(req.body.limit);
    log.debug(req.body.skip);
    const order = req.body.order ? req.body.order : "desc";
    const sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    const limit = req.body.limit ? parseInt(req.body.limit) : 100;
    // skip decides how many products are skipped when being fetched
    // needed for "load more books" in shop page
    const skip = parseInt(req.body.skip);
    const findArgs = {};
    log.debug("Product was searched by user:", order, sortBy, limit);

    log.debug("Filters in request body:", req.body.filters, typeof req.body.filters);
    /**
    const filters = req.body.filters;
    const priceRange = filters.price;
    log.debug("priceRange", priceRange);
    const bottomPrice = priceRange[0];
    log.debug("bottomPrice", bottomPrice);
    const topPrice = priceRange[1];
    log.debug("topPrice", topPrice);
    const category = filters.category[0];
    log.debug("category", category);
     **/

    for (const key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1],
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    log.debug("Products in range should have the args:", findArgs);
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found",
                });
            }
            res.json({
                size: data.length,
                data,
            });
        });
};

/**
 * works as middleware to provide photo of product
 * @param req
 * @param res
 * @param next
 * @returns {boolean | void}
 */
exports.getProductPhoto = (req, res, next) => {
    log.debug("Product photo is requested");
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

/**
 * get the six top selling products to display on home screen
 * @param req
 * @param res
 */
exports.listAllProducts = (req, res) => {
    log.debug("List of products was requested");
    Product.find({sold: {$gt: 0}})
        .limit(6)
        .exec((err, products) => {
            if (err) {
                return res.status(400)
                    .json({error: "No Products found"});
            }
            log.debug("Sold products were found");
            return res.json({products});
        });
};
