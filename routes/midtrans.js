const express = require('express');
const router = express.Router();
const midtransData = require('../controllers/midtrans');


router.put('/midtrans', midtransData);

module.exports = router;
