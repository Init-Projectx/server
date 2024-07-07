const express = require('express');
const router = express.Router();
const stockController = require('../../controllers/cms/stockController');

router.post('/', stockController.addStock);
router.get('/:warehouse_id', stockController.getStock);

module.exports = router;