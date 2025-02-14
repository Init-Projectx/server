const warehouseService = require('../services/warehouseService');

const findAll = async (req, res, next) => {
    try {
        const params = {
            status: 'active'
        }
        const data = await warehouseService.findAll(params);

        res.status(200).json({
            message: 'Get Data Warehouse Success',
            data: data
        });

    } catch (error) {
        next(error);
    }
}

const findOne = async (req, res, next) => {
    try {
        const params = {
            id: +req.params.id,
            status: 'active'
        }
        const data = await warehouseService.findOne(params);

        res.status(200).json({
            message: 'Get Data Warehouse Success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}


module.exports = { findAll, findOne };