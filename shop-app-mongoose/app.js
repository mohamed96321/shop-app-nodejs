const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

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

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
.connect(
  MONGODB_URI
)
.then(result =>{
  User.findOne()
  .then(user => {
    if (!user) {
      const user = new User({
        name: 'Mohammed',
        email: 'test@test.com',
        cart: {
          items: []
        }
      });
      user.save();
    }
  });
  app.listen(3000);
})
.catch(err => console.log("Database not connected successfully: ", err));
