const Product = require('../models/products.js');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product',
  { 
    pageTitle: 'AZUW Admin | Add Product', 
    path: '/admin/add-product'
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'AZUW Admin | Manage Products', 
      path: '/admin/products'
    });
  });
};
