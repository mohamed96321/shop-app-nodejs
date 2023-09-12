const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const reEmail = '@gmail.com';

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', 
  [
    check('email')
    .isEmail()
    .matches('@g?mail\.com$')
    .withMessage('Please enter a valid email')
    ,
    body(
      'password', 
      'Password must contain at least 6 characters(e.g. @Mp579).'
    )
    .matches('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{6,}$'),
    body('confirmPassword').custom((value, { req }) => {
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

module.exports = router;