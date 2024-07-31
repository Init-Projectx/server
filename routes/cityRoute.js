const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.get('/search', cityController.searchCities);
router.get('/', cityController.findAll);
router.get('/:id', cityController.findOne);

module.exports = router;
