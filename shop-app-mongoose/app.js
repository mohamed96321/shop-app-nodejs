const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const app = express();

// Config hbs file
// app.set('view engine', 'hbs');
// app.set('views', 'views');

// Config pug file
// app.set('view engine', 'pug');
// app.set('views', 'views');

// Config ejs file
app.set('view engine', 'ejs');
app.set('views', 'views');

const MONGODB_URI = 'mongodb+srv://mohamedatef556:Mohamed96321Atef@cluster0.pponlh5.mongodb.net/shop';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const authRoutes = require('./routes/auth.js');

const errorController = require('./controllers/erorr.js');
const User = require('./models/user.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({ 
  secret: 'my secret', 
  resave: false, 
  saveUninitialized: false, 
  store: store 
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated=  req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Dummy error.');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    // throw new Error('Error occurred');
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  })
  .catch(err => {
    // throw new Error(err);
    next(new Error(err));
  });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error 500', 
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
.connect(
  MONGODB_URI
)
.then(result =>{
  app.listen(3000);
})
.catch(err => console.log("Database not connected successfully: ", err));
