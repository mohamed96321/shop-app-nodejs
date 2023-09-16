const express = require('express');
const path = require('path');

const { body } = require('express-validator');

const adminController = require('../controllers/admin.js');
const isAuth = require('../middleware/is-auth.js');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/add-product => POST
router.post('/add-product', [
  body('title')
  .isString()
  .isLength({ min: 4 })
  .trim(),
  body('price').isFloat(),
  body('description')
  .isLength({ min: 5, max: 100 })
  .trim()
  ], 
  isAuth, 
  adminController.postAddProduct
);

// /admin/edit-product => POST
router.post('/edit-product', [
  body('title')
  .isString()
  .isLength({ min: 4 })
  .trim(),
  body('price').isFloat(),
  body('description')
  .isLength({ min: 5, max: 100 })
  .trim()
  ], 
  isAuth, 
  adminController.postEditProduct
  );

// /admin/delete-product => POST
// router.post('/delete-product', isAuth, adminController.postDeleteProduct);
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;