const Category = require("../models/category");

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400)
        .json({ error: err.message });
    }
    res.json({ data });
  });
};

exports.categoryById = (req, res, next, id) => {
  Category.findById(id)
    .exec((err, category) => {
      if (err || !category) {
        return res.status(400)
          .json({ error: "Category does not exist" });
      }
      return res.json({ category });
    });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
}
