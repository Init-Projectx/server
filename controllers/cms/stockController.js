const stockService = require('../../services/stockService.js');


const addStock = async (req, res, next) => {
    const { productId, warehouseId, quantity } = req.body;

    try {
      const updatedStock = await stockService.addStock(productId, warehouseId, quantity);
      res.status(200).json({
        message : 'update stock success!!', 
        data : updatedStock
      });
    } catch (error) {
      next(error);
    }
}

const getStock = async (req, res, next) => {
    const { productId, warehouseId } = req.query;

  try {
    const stock = await stockService.getStock(productId, warehouseId);

    res.status(200).json({
      message : 'stock data', 
      data : stock
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {addStock, getStock};