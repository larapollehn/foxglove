const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");

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

exports.productById = (req, res, next) => {

};
