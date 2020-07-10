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
            return res.status(400).json({ error: err.message });
        }
        const product = new Product(fields);
        if (files.photo) {
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((error, result) => {
            if (error) {
                return res.status(400).json({ error: error.message });
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
          req.product = product ;
          next();
      })
};

/**
 * returns the requested product based on the product id in params
 */
exports.read = (req, res) => {
    req.product.photo = undefined; // set to undefined because it is not needed for this operation and file size could be huge
    return res.json(req.product);
}

/**
 * remove product
 * @param req
 * @param res
 */
exports.removeProduct = (req, res) => {
    const product = req.product;
    log.debug("product was requested to be deleted", product.id);
    product.remove((err, deleteProduct) => {
        if(err){
            return res.status(400).send("Product could not be deleted");
        }
        res.json({deleteProduct, message: "Product deleted successfully"});
    })
}
