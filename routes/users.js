'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = express.Router();

router.get('/signup', (req, res) => {
  if (req.session.userId) {
    res.redirect('profile');
  } else {
    res.render('signup');
  }
});

router.post('/signup', (req, res) => {
  if (!req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password) {
    res.status(400).render('signup', {
      error: 'Oops! You forgot to fill in some of the fields',
    });
  }

  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };

  User.findOne({email: userData.email}, (err, user) => {
    if (err) throw err;
    if (user) {
      res.status(400)
        .render('signup', {
          error: 'That email address is already in use',
        });
    }
    else {
      User.create(userData, (err, user) => {
        if (err) throw err;
        req.session.userId = user._id;
        return res.redirect('profile');
      });
    }
  });
});

router.get('/signin', (req, res) => {
  if (req.session.userId) {
    res.redirect('profile');
  } else {
    res.render('signin');
  }
});

router.post('/signin', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).render('signup', {
      error: 'Oops! You forgot to fill in some of the fields',
    });
  }

  User.findOne({email: req.body.email}, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.status(400)
        .render('signin', {
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
        user: {
          firstName: user.firstName,
        },
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
