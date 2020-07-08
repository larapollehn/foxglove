"use strict";

exports.createProduct = (req, res, next) => {
  req.check("name",)
    .notEmpty();
  req.check("description",)
    .notEmpty();
  req.check("price",)
    .notEmpty();
  req.check("category",)
    .notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400)
      .send("All fields are required");
  }
  next();
};
