const Product = require('../models/products.js');


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'AZUW | Home', 
      path: '/products'
    });
  });
};

exports.getView = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/view', {
      prods: products,
      pageTitle: 'AZUW Store', 
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'AZUW | My Cart', 
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'AZUW | Payment', 
  });
};
