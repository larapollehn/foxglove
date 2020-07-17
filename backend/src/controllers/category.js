const Category = require("../models/category");
const log = require("../utils/Logger");

/**
 * only admins can create new categories
 * @param req
 * @param res
 */
exports.create = (req, res) => {
  log.debug("Create new category");
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400)
        .json({ error: err.message });
    }
    res.json({ data });
  });
};

/**
 * gives the product based on product id in url
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.categoryById = (req, res, next, id) => {
  log.debug("Find category by id");
  Category.findById(id)
    .exec((err, category) => {
      if (err || !category) {
        return res.status(400)
          .json({ error: "Category does not exist" });
      }
        log.debug("Category found", category);
        req.category = category;
        next();
    });
};

exports.getCategory = (req, res) => res.json(req.category);

exports.removeCategory = (req, res) => {
  log.debug("Remove category");
  const { category } = req;
  category.remove((err, data) => {
    if (err) {
      return res.status(400)
        .json({ error: "Category could not be removed" });
    }
    return res.json({ message: "Category successfully removed" });
  });
};

exports.updateCategory = (req, res) => {
  log.debug("Updating category");
  const { category } = req;
  category.name = req.body.name;
  log.debug("Category was changed", category, req.body.name);
  category.save((err, data) => {
    if (err) {
      return res.status(400)
        .json({ error: "Category could not be updated" });
    }
    return res.json({ data });
  });
};

/**
 * gets all distinct categories for which products are available
 * @param req
 * @param res
 */
exports.listAllCategories = (req, res) => {
  log.debug("List all categories");
  Category.distinct("name")
    .exec((err, category) => {
      if (err || !category) {
        return res.status(400)
          .json({ error: "Categories could not be fetched" });
      }
      return res.json({ category });
    });
};
