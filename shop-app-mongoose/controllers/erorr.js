exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Error 404', 
    path: '/404',
    isAuthenticated: req.isLoggedIn
  });
}