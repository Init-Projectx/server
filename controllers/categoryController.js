const categoryService = require("../services/categoryService");

const findAll = async (req, res, next) => {
  try {
    const categories = await categoryService.findAll();

    res.status(200).json({
      message: "Get category data success",
      data: categories,
    });
  } catch (error) {    
      next(error);    
  }
};

const findOne = async (req, res, next) => {
  try {
    const id = req.params.id;

    const category = await categoryService.findOne(id);

    res.status(200).json({
      message: "Get category by id success",
      data: category,
    });
  } catch (error) {    
      next(error);    
  }
};

module.exports = { findAll, findOne };
