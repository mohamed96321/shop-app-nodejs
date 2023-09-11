const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLoginAuth);

router.post('/login', authController.postLoginAuth);

module.exports = router;
