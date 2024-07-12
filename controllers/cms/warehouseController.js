const warehouseService = require('../../services/warehouseService');

const findAll = async (req, res, next) => {
    try {
        const data = await warehouseService.findAll();

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
            id: +req.params.id
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

const create = async (req, res, next) => {
    try {
        const params = { ...req.body }

        const data = await warehouseService.create(params);

        res.status(200).json({
            message: 'Create Warehouse Success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const params = { ...req.body, id: req.params.id };

        const data = await warehouseService.update(params);

        res.status(200).json({
            message: 'Update Warehouse Success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

// soft delete
const destroy = async (req, res, next) => {
    try {
        const params = {
            id: +req.params.id,
            status: 'active'
        }

        const data = await warehouseService.destroy(params);

        res.status(200).json({
            message: 'Delete Warehouse Success'
        });
    } catch (error) {
        next(error);
    }
}

const activatedWarehouse = async (req, res, next) => {
    try {
        const params = {
            id: +req.params.id,
            status: 'inactive'
        }

        const data = await warehouseService.activatedWarehouse(params);

        res.status(200).json({
            message: 'Activated Warehouse Success',
            data: data
        });

    } catch (error) {
        next(error)
    }
}


module.exports = { findAll, findOne, create, update, destroy, activatedWarehouse };