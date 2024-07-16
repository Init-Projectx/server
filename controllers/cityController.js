const { param } = require('../routes/cityRoute');
const cityService = require('../services/cityService');

const findAll = async (req, res, next) => {
    try {
        const params = {
            page: req.query.page,
            take: req.query.pageSize
        }

        const data = await cityService.findAll(params)

        res.status(200).json({
            message: 'Get Cities Data Success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

const findOne = async (req, res, next) => {
    try {
        const id = req.params.id
        const data = await cityService.findOne(id);

        res.status(200).json({
            message: 'Get City By Id Success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { findAll, findOne };