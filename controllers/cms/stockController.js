const stockService = require('../../services/stockService');

const addStock = async (req, res, next) => {
    try {
        const params = { ...req.body }

        const data = await stockService.addStock(params);

        res.status(200).json({
            message: 'Adding stock success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

const updateStock = async (req, res, next) => {
    try {
        const params = {
            product_id: +req.params.product_id,
            ...req.body
        }

        const data = await stockService.updateStock(params);

        res.status(200).json({
            message: 'Update Stock Success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

const getStock = async (req, res, next) => {
    try {
        const params = {
            warehouse_id: req.params.warehouse_id,
            product_id: req.body.product_id
        }

        const data = await stockService.getStock(params)

        res.status(200).json({
            message: 'Get Stock Success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { addStock, getStock, updateStock };