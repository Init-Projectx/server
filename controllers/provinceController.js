const provinceService = require('../services/provinceService');

const findAll = async (req, res, next) => {
    try {
        const data = await provinceService.findAll();

        res.status(200).json({
            message: 'Get data province success',
            data: data
        });

    } catch (error) {
        next(error);
    }
}

const findOne = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const data = await provinceService.findOne(id);

        res.status(200).json({
            message: 'Get province by id success',
            data: data
        })

    } catch (error) {
        next(error);
    }
}

const searchProvince = async (req, res, next) => {
    try {
        const params = req.query;
        const data = await provinceService.searchProvince(params);

        res.status(200).json(data);
    } catch (error) {
        next(error)
    }
}

module.exports = { findAll, findOne, searchProvince };