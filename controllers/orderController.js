
const { user } = require('../lib/prisma');
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
  } catch (error) {
    next(error);
  }
};

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
      user_id: req.loggedUser.id,
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
    const params = {
      id: req.params.id,
      user: req.loggedUser,
      status: { status: 'delivered' }
    }

    const data = await orderService.updateStatus(params);

    res.status(200).json({
      message: 'Update status success',
      data: data
    });
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

const handleNotification = async (req, res, next) => {
  try {
    await orderService.handleNotification(req.body);
    res.status(200).json({ message: 'Notification handled' });
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne, updateStatus, payment, handleNotification, createOrder };
