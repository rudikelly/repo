const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup', {title: 'Sign Up'});
});

router.post('/signup', (req, res) => {
  if (req.body.firstName &&
      req.body.lastName &&
      req.body.email &&
      req.body.password) {

    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };

    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;
      else if (user) {
        res.status(400)
          .render('signup', {
            title: 'Sign Up',
            error: 'That email address is already in use',
          });
      }
      else {
        User.create(userData, function (error, user) {
          if (error) {
            throw error;
          } else {
            req.session.userId = user._id;
            return res.send('signed in as ' + user.firstName);
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

router.get('/signin', (req, res) => {
  res.render('signin', {title: 'Sign In'});
});

router.post('/signin', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.sendStatus(400);
  }

  User.findOne({email: req.body.email}, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.status(400)
        .render('signin', {
          title: 'Sign In',
          error: 'Invalid credentials',
        });
    } else {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) throw err;
        if (result) {
          req.session.userId = user._id;
          res.redirect('profile');
        } else {
          res.status(400)
            .render('signin', {
              title: 'Sign In',
              error: 'Invalid credentials',
            });
        }
      });
    }
  });
});

router.get('/profile', (req, res) => {
  if (req.session.userId) {
    User.findOne({_id: req.session.userId}, (err, user) => {
      if (err) throw err;
      res.render('profile',  {
        name: user.firstName,
      });
    });
  }
  else {
    res.redirect('/');
  }
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) throw err;
    });
  }
  res.redirect('/');
});

module.exports = router;
