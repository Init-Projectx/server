const productService = require('../services/productService');

const findAll = async (req, res, next) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page); 
        limit = Number(limit); 

        const products = await productService.findAll({ page, limit }, false);
        res.status(200).json({
            message: 'success get all data',
            data: products
        });
    } catch (error) {
        next(error);
    }
};

const findOne = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await productService.findOne(slug, false);
        res.status(200).json({
            message: 'Success get data',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

const findByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const products = await productService.findByCategory(categoryId);
        res.status(200).json({
            message: 'success get data from category',
            data: products
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {findAll, findOne, findByCategory};