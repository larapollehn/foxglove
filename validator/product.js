'use strict';

exports.createProduct = (req, res, next) => {
    req.check("name", "Name is required").notEmpty();
    req.check("description", "Description is required").notEmpty();
    req.check("price", "Price is required").notEmpty();
    req.check("category", "Category is required").notEmpty();
    const errors = req.validationErrors();
    if (errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).send(firstError);
    }
    next();
}