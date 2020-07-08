'use strict';

const Category = require("../models/category");


exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err){
            return res.status(400).json({error: err.message});
        }
        res.json({data});
    })
}
