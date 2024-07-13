const cartService = require('../services/cartService');

const findOne = async (req, res, next) => {
    try {
        const params = {
            id: +req.params.id,
            user_id: +req.loggedUser.id
        }

        console.log('<<<<<<<<<<<controller', params);

        const data = await cartService.findOne(params);

        res.status(200).json({
            message: 'Get Cart by id Success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        //req.body butuh shipping method dan kurir gess
        const params = {
            id: req.params.id,
            user_id: req.loggedUser.id,
            ...req.body
        }

        const data = await cartService.update(params);

        res.status(200).json({
            message: 'Update Cart Success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

const reset = async (req, res, next) => { }

const deleteProduct = async (req, res, next) => { }

module.exports = { findOne, update, reset, deleteProduct };