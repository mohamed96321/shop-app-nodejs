const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');

// Enable hbs file
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views/layouts/'));
app.set('views', 'views');

// Enable pug file
// app.set('view engine', 'pug');
// app.set('views', 'views');

const adminData = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(3000);
