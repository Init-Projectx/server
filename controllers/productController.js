const productService = require('../services/productService');

const findAll = async (req, res, next) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page); 
        limit = Number(limit); 

        const products = await productService.findAll({ page, limit }, false);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findOne = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await productService.findOne(slug, false);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


module.exports = {findAll, findOne};