const product = require('../models/product');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product',
  { 
    pageTitle: 'AZUW Admin | Add Product', 
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title, 
    price: price, 
    description: description, 
    imageUrl: imageUrl,
    userId: req.user
  });
  product
  .save()
  .then(result => {
    console.log("Created Product");
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save();
  })
  .then(result => {
    console.log("Updated Product");
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
}; 

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product
  .findById(prodId)
  .then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', { 
      pageTitle: 'AZUW Admin | Edit Product', 
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  Product
  .find()
  // .select('title price -_id')
  // .populate('userId', 'name')
  .then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'AZUW Admin | Manage Products', 
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
  .then(result => {
    console.log("Product is removed!")
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};
