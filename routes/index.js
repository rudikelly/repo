'use strict';

const express = require('express');

const User = require('../models/user');

const router = express.Router();

/**
 * GET /admin
 * Index/Home page.
 */
router.get('/', (req, res) => {
  if (req.user) {
    res.render('home',  {
      user: {
        firstName: req.user.firstName,
      },
    });
  }
  else {
    res.render('home');
  }
});

module.exports = router;
