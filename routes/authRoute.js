const router = require('express').Router();
const authController = require('../controllers/authController');
const authCms = require('../controllers/cms/authController');

router.post('/login', authController.login);
router.post('/cms/login', authCms.login);
router.post('/register', authController.register);

module.exports = router;