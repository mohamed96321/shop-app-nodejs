const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Order = require('../models/order'); // Import the Order model
const Product = require('../models/product');

const ITEMS_PER_PAGE = 16;

// exports.getProducts = (req, res, next) => {
//   Product
//   .find()
//   .then((products) => {
//     res.render('shop/product-list', {
//       prods: products,
//       pageTitle: 'AZUW Store | Products', 
//       path: '/products'
//     });
//   })
//   .catch(err => {
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
//   });
// };

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product
  .findById(prodId)
  .then(product => {
    res.render('shop/product-details', {
      product: product,
      pageTitle: `AZUW Store | ${product.title}`,
      path: '/products'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getView = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find().countDocuments()
  .then(numProducts => {
    totalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  })
  .then((products) => {
    res.render('shop/view', {
      prods: products,
      pageTitle: 'AZUW Store', 
      path: '/',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'AZUW Store | My Cart', 
      products: products
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
    return req.user.addToCart(product);
  })
  .then(result => {
    console.log(result);
    res.redirect('/cart');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .removeFromCart(prodId)
  .then(result => {
    res.redirect('/cart');
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'AZUW Store | My Orders', 
      orders: orders
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    }); 
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products: products
    });
    return order.save();
  })
  .then(result => {
    req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postDeleteOrder = (req, res, next) => {
  const orderId = req.body.orderId;
  Order.deleteOne({ _id: orderId})
  .then(result => {
    console.log("Order is removed!")
    res.redirect('/orders');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        const error = new Error('No order found.');
        error.statusCode = 404;
        throw error;
      }
      // Perform the authorization check here
      if (order.user.userId.toString() !== req.user._id.toString()) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
      }

      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'orders', invoiceName);

      const pdfDoc = new PDFDocument();

      pdfDoc.fontSize(26).text('Invoice', { underline: true });

      pdfDoc.fontSize(20).text('----------------------------------');

      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc.fontSize(16).text('Product Name: ' + prod.product.title);
        pdfDoc.fontSize(16).text('Quantity: ' + prod.quantity);
        pdfDoc.fontSize(16).text('Product Price: $' + prod.product.price);
        pdfDoc.fontSize(20).text('----------------------------------');
      });

      pdfDoc.fontSize(16).text('Total Price: $' + totalPrice);

      pdfDoc.pipe(fs.createWriteStream(invoicePath)); // Save the PDF to the local file path

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      pdfDoc.pipe(res); // Stream the PDF as a response

      pdfDoc.end();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    // .catch(err => {
    //   if (!err.statusCode) {
    //     err.statusCode = 500;
    //   }
    //   next(err);
    // });
};
