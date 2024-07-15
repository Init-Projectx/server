const express = require('express');
const router = express.Router();
const stockController = require('../../controllers/cms/stockController');

router.post('/', stockController.addStock);
router.put('/:product_id', stockController.updateStock);
router.get('/:warehouse_id', stockController.getStock);

module.exports = router;