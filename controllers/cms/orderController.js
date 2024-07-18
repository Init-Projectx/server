const orderService = require('../../services/orderService');

const findAll = async (req, res, next) => {
  try {
    const data = await orderService.findAll();

    res.status(200).json({
      message: 'Get all orders success',
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

const updateStatus = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      user: req.loggedUser,
      status: req.body
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

module.exports = { findAll, findOne, updateStatus };
