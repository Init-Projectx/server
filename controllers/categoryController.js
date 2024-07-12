const categoryService = require("../services/categoryService");

const findAll = async (req, res, next) => {
  try {
    const categories = await categoryService.findAll();

    res.json(categories);
  } catch (error) {
    if (error.name === "failedGetCategoryData") {
      res.status(500).json({ message: "Failed to get category data" });
    } else {
      next(error);
    }
  }
};

const findOne = async (req, res, next) => {
  try {
    const categoryName = req.params.categoryName;

    const category = await categoryService.findOne(categoryName);

    res.json(category);
  } catch (error) {
    if (error.name === "categoriesNotFound") {
      res.status(404).json({ message: "Category not found" });
    } else {
      next(error);
    }
  }
};

module.exports = { findAll, findOne };
