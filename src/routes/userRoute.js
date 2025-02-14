const express = require('express');
const router = express.Router();
const uploadImage = require('../middlewares/multerUser');
const userController = require('../controllers/userController');

router.get('/', userController.findOne);
router.put('/', uploadImage.single('photo'), userController.update);

module.exports = router;