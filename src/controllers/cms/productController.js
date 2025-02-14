const ProductService = require('../../services/productService');
// Ganti error menjadi next(err) json message, dan tambah data

const findAll = async (req, res, next) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = +page;
        limit = +limit;

        const products = await ProductService.findAll({ page, limit }, true);
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
        const product = await ProductService.findOne(slug, true);
        res.status(200).json({
            message: 'success get one data',
            data: product
        });
    } catch (error) {
        next(error)
    }
};


const findByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const products = await ProductService.findByCategory(categoryId);
        res.status(200).json({
            message: 'success get data from category',
            data: products
        });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const newProduct = await ProductService.create(req.body, req.file, req.err);
        res.status(201).json({
            message: 'create product success',
            data: newProduct
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const updatedProduct = await ProductService.update(slug, req.body, req.file, req.err);
        res.status(200).json({
            message: 'update product success',
            data: updatedProduct
        });
    } catch (error) {
        next(error);
    }
};


const softDelete = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const deletedProduct = await ProductService.softDelete(slug);
        res.status(200).json({
            message: 'delete product success',
            data: deletedProduct
        });
    } catch (error) {
        next(error);
    }
};


const returnSoftDelete = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const returnProduct = await ProductService.returnSoftDelete(slug);
        res.status(200).json({
            message: 'return product success',
            data: returnProduct
        });
    } catch (error) {
        next(error);
    }
}


module.exports = { findAll, findOne, findByCategory, create, update, softDelete, returnSoftDelete };