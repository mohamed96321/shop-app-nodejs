const Product = require('../models/products.js');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product',
  { 
    pageTitle: 'AZUW | Admin', 
    path: '/admin/add-product'
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'AZUW | Admin Products', 
      path: '/admin/products'
    });
  });
};
