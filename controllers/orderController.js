// controllers/userOrderController.js
const orderService = require('../services/orderService');

const findAll = async (req, res, next) => {
  const userId = req.user.id; // Assuming req.user contains the authenticated user's info
  try {
    const orders = await orderService.findAll({ where: { user_id: userId } });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id; // Assuming req.user contains the authenticated user's info
  try {
    const order = await orderService.findOne({ where: { id: parseInt(id, 10), user_id: userId } });
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
  const userId = req.user.id; // Assuming req.user contains the authenticated user's info
  try {
    const order = await orderService.findOne({ where: { id: parseInt(id, 10), user_id: userId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const updatedOrder = await orderService.updateStatus(parseInt(id, 10), status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

const payment = async (req, res, next) => {
  try {
    const paymentResult = await orderService.payment(req.body);
    res.status(200).json(paymentResult);
  } catch (error) {
    next(error);
  }
};

const handleNotification = async (req, res, next) => {
  try {
    await orderService.handleNotification(req.body);
    res.status(200).json({ message: 'Notification handled' });
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne, updateStatus, payment, handleNotification };
