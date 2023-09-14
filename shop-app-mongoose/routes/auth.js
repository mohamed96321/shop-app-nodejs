const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const reEmail = '@gmail.com';

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Invalid email or password. Please enter correct one.')
    // .normalizeEmail()
    ,
    body('password')
    .custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      }
      throw new Error('Password must be matched with Your Password.');
    })
  ], 
  authController.postLogin);

router.post('/signup', 
  [
    check('email')
    .isEmail()
    .matches('@g?mail\.com$')
    .withMessage('Please enter a valid email.')
    // .normalizeEmail()
    ,
    body(
      'password', 
      'Password must contain at least 5 characters.'
    )
    // .trim()
    .matches('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{5,}$'),
    body('confirmPassword')
    // .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password & Confirm Password have to match!');
      }
      return true;
    })
  ], 
  authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.get('/verified/:token', authController.getVerified);

router.post('/account-verified', authController.postVerified);

module.exports = router;