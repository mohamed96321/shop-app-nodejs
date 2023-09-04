const express = require('express');
const path = require('path');
const rootDir = require('../util/path.js');

const adminData = require('./admin.js');

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', 
  {
    prods: products,
    pageTitle: 'AZUW | Shop', 
    path: '/', 
    hasProduct: products.length > 0,
    activeShop: true
  });
});

module.exports = router;
