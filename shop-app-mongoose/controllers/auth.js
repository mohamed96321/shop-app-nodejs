const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { validationResult } = require('express-validator');
const user = require('../models/user');
const errorMsg = 'Invalid email or password. Please enter correct one.';

// API Keys For Google
const GOOGLE_CLIENT_ID = '';
const GOOGLE_CLIENT_SECRET = '';
const REFRESH_TOKEN = '';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const MY_EMAIL = 'atefm.me499@gmail.com';

const oAuthClient = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

oAuthClient.setCredentials({ refresh_token: REFRESH_TOKEN });
const ACCESS_TOKEN = oAuthClient.getAccessToken();
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: MY_EMAIL,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: ACCESS_TOKEN
  }
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'ASUW Store | Login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'ASUW Store | Sign In',
      errorMessage: errors.array()[0].msg
    });
  }
  User.findOne({email: email})
    .then(user => {
      if (!user) {
        req.flash('error', errorMsg);
        return res.redirect('/login');
      }
      if (user.isVerified === false) {
        req.flash('error', 'Please check your email to verify account.');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            return res.redirect('/');
          });
        }
        req.flash('error', 'Password should be matched with Your Password.');
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err)
        res.redirect('/login');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.postSignup = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (err) {
      console.log(err);
      return res.redirect('/signup');
    }

    const token = buffer.toString('hex');
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'ASUW Store | Sign Up',
        errorMessage: errors.array()[0].msg
      });
    }
    User.findOne({email: email})
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email exists already. Please pick another email.');
        return res.redirect('/signup');
      }
      return bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          isVerified: false,
          cart: { items: [] },
          resetToken: token,
          resetTokenExpiration: Date.now() + 3600000
        });
        return user.save();
      }).then(user => {
        res.redirect('/login');
        return transporter.sendMail({
          to: email,
          from: MY_EMAIL,
          subject: 'Succeeded Signing up!',
          html: `
            <p>Congrats! you are signing up successfully.</p>
            <p>Click the link below to verify your email.</p>
            <a href="http://localhost:3000/verified/${token}">Click here</a>
          `
        });
      })
      .then((info) => {
        console.log('SUCCESS');
      })
      .catch(err => console.log(err));
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'ASUW Store | Signup',
    errorMessage: message
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'ASUW Store | Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        req.flash('error', 'No account with that email. Please enter correct email.');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then(result => {
      res.redirect('/');
      return transporter.sendMail({
        to: req.body.email,
        from: MY_EMAIL,
        subject: 'Password Reset.',
        html: `
          <p>You requested a password reset</p>
          <p>Click this link below, to set a new password</p>
          <a href="http://localhost:3000/reset/${token}">Click here</a>
        `
      });
    })
    .then(info => {
        console.log('Email sent successfully');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
  .then(user => {
    let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/new-password', {
    path: '/new-password',
    pageTitle: 'ASUW Store | Update Password',
    errorMessage: message,
    userId: user._id.toString(),
    passwordToken: token
  });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken= undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getVerified = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
  .then(user => {
    res.render('auth/verify', {
      path: '/account-verified',
      pageTitle: 'ASUW Store | Verify Account',
      userId: user._id.toString(),
      isVerifiedToken: token
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postVerified = (req, res, next) => {
  const userId = req.body.userId;
  const isVerifiedToken = req.body.isVerifiedToken;
  let resetUser;
  User.findOne({resetToken: isVerifiedToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
  .then(user => {
    resetUser = user;
    return resetUser;
  }).then(resetUser => {
    resetUser.isVerified = true;
    resetUser.resetToken= undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};
