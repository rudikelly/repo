'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = express.Router();

/**
 * GET /signup
 * Signup page.
 */
router.get('/signup', (req, res) => {
  if (req.user) {
    return res.redirect('profile');
  }
  res.render('signup');
});

/**
 * POST /signup
 * Creates user accounts.
 */
router.post('/signup', (req, res) => {
  if (!req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password) {
    return res.status(400).render('signup', {
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
      return res.status(400)
        .render('signup', {
          error: 'That email address is already in use',
        });
    }
    User.create(userData, (err, user) => {
      if (err) throw err;
      req.session.userId = user._id;
      return res.redirect('profile');
    });
  });
});

/**
 * GET /signin
 * Presents login page.
 */
router.get('/signin', (req, res) => {
  if (req.user) {
    return res.redirect('profile');
  }
  res.render('signin');
});

router.post('/signin', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).render('signup', {
      error: 'Oops! You forgot to fill in some of the fields',
    });
  }

  User.findOne({email: req.body.email}, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.status(400)
        .render('signin', {
          error: 'Invalid credentials',
        });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) throw err;
      if (result) {
        req.session.userId = user._id;
        return res.redirect('profile');
      }
      res.status(400)
        .render('signin', {
          error: 'Invalid credentials',
        });
    });
  });
});

/**
 * GET /profile
 * User's profile page.
 */
router.get('/profile', (req, res) => {
  if (req.user) {
    return res.render('profile',  {
      user: {
        firstName: req.user.firstName,
      },
    });
  }
  res.redirect('/');
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
