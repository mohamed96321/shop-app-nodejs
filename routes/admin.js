const express = require('express');
const path = require('path');
const rootDir = require('../util/path.js');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.render('add-product',
  { 
    pageTitle: 'AZUW | Admin', 
    path: '/admin/add-product',
    activeProduct: true
  });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
