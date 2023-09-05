const Product = require('../models/products.js');


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'AZUW Store | Products', 
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('shop/product-details', {
      product: product,
      pageTitle: `AZUW Store | ${product.title}`,
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
    pageTitle: 'AZUW Store | My Cart', 
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'AZUW Store | My Orders', 
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'AZUW Store | Payment', 
  });
};
