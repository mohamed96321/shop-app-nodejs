const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');

// Config hbs file
// app.set('view engine', 'hbs');
// app.set('views', 'views');

// Config pug file
// app.set('view engine', 'pug');
// app.set('views', 'views');

// Config hbs file
app.set('view engine', 'ejs');
app.set('views', 'views');

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
