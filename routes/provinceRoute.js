const express = require('express');
const router = express.Router();
const provinceController = require('../controllers/provinceController');

router.get('/search', provinceController.searchProvince);
router.get('/', provinceController.findAll);
router.get('/:id', provinceController.findOne);

module.exports = router;
