const { warehouse, cart_items } = require('../lib/prisma');
const cartService = require('../services/cartService');

const findOne = async (req, res, next) => {
    try {
        const params = {
            id: +req.params.id,
            user: req.loggedUser.id
        }

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
        const params = {
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

const reset = async (req, res, next) => {
    try {
        const params = {
            user_id: req.loggedUser.id
        }

        const data = await cartService.reset(params);

        res.status(200).json({
            message: 'Reset Cart Success',
            data: data
        })
    } catch (error) {
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const params = {
            user_id: req.loggedUser.id,
            product_id: req.params.product_id
        }

        const data = await cartService.deleteProduct(params);

        res.status(200).json({
            message: 'Delete cart items success'
        });
    } catch (error) {
        next(error);
    }
}

const getShippingCost = async (req, res, next) => {
    try {
        const params = {
            ...req.body
        }

        const data = await cartService.getShippingCost(params);

        res.status(200).json({
            message: 'Get shipping cost success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { findOne, update, reset, deleteProduct, getShippingCost };