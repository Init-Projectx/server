<<<<<<< Updated upstream
// controllers/adminOrderController.js
const orderService = require('../services/orderService');
=======
<<<<<<< Updated upstream
const findAll = async (req, res, next) => {}
>>>>>>> Stashed changes

const findAll = async (req, res, next) => {
  try {
    const orders = await orderService.findAll({});
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

<<<<<<< Updated upstream
const findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await orderService.findOne({ where: { id: parseInt(id, 10) } });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
=======
const updateStatus = async (req, res, next) => {}
=======
// controllers/adminOrderController.js
const orderService = require('../../services/orderService');

const findAll = async (req, res, next) => {
  try {
    const data = await orderService.findAll();

    res.status(200).json({
      message: 'Get all orders success',
      data: data
    });
>>>>>>> Stashed changes
  } catch (error) {
    next(error);
  }
};
<<<<<<< Updated upstream
=======

const findOne = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      loggedUser: req.loggedUser
    }

    const data = await orderService.findOne(params);

    res.status(200).json({
      message: 'Get orders data success',
      data: data
    });
  } catch (error) {
    next(error);
  }
};
>>>>>>> Stashed changes
>>>>>>> Stashed changes

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await orderService.updateStatus(parseInt(id, 10), status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne, updateStatus };
