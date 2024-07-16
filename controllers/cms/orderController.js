// controllers/adminOrderController.js
const orderService = require('../services/orderService');

const findAll = async (req, res, next) => {
  try {
    const orders = await orderService.findAll({});
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await orderService.findOne({ where: { id: parseInt(id, 10) } });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

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
