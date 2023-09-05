const express = require('express');
const path = require('path');

const adminController = require('../controllers/admin.js');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

module.exports = router;