<<<<<<< Updated upstream
// controllers/userOrderController.js
const orderService = require('../services/orderService');
=======
<<<<<<< Updated upstream
const findAll = async (req, res, next) => {}
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
const payment = async (req, res, next) => {
  try {
    const paymentResult = await orderService.payment(req.body);
    res.status(200).json(paymentResult);
=======
// menerima webhook dari midtrans
const handleNotification = async (req, res, next) => {}
=======
// controllers/userOrderController.js
const { token } = require('morgan');
const orderService = require('../services/orderService');

const findAll = async (req, res, next) => {
  try {
    const params = {
      user_id: +req.loggedUser.id
    };
    const data = await orderService.findAll(params);

    res.status(200).json({
      message: 'Get data orders success',
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

const createOrder = async (req, res, next) => {
  try {
    const params = {
      userId: req.loggedUser.id,
      ...req.body
    }

    const data = await orderService.createOrder(params);

    res.status(200).json({
      message: 'Create order success',
      data: data
    });
  } catch (error) {
    next(error);
  }
}

const updateStatus = async (req, res, next) => {
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
    const params = {
      user: req.loggedUser,
      orderId: req.params.id
    }

    const data = await orderService.payment(params);

    res.status(200).json({
      message: 'Payment Midtrans success',
      token: data
    });
  } catch (error) {
    next(error);
  }
};
>>>>>>> Stashed changes
>>>>>>> Stashed changes

const handleNotification = async (req, res, next) => {
  try {
    await orderService.handleNotification(req.body);
    res.status(200).json({ message: 'Notification handled' });
  } catch (error) {
    next(error);
  }
};

<<<<<<< Updated upstream
module.exports = { findAll, findOne, updateStatus, payment, handleNotification };
=======
<<<<<<< Updated upstream
module.exports = {findAll, findOne, updateStatus, payment, handleNotification};
=======
module.exports = { findAll, findOne, updateStatus, payment, handleNotification, createOrder };
>>>>>>> Stashed changes
>>>>>>> Stashed changes
