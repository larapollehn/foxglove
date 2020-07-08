'use strict';
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err){
            return res.state(400).json({error: "Image could not be uploaded"});
        }
        let product = new Product(fields);
        if(files.photo){
            product.photo.data = fs.readdirSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, result) => {
            if(err){
                return res.status(400).json({error: err.message})
            }
            return  res.json({result});
        })
    })
}