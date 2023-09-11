const User = require('../models/user');

exports.getLoginAuth = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'AZUW Store | Login',
    isAuthenticated: isLoggedIn
  })
};

exports.postLoginAuth = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/');
};
