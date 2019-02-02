'use strict';

const express = require('express');

const User = require('../models/user');

const router = express.Router();

/**
 * GET /
 * Index/Home page.
 */
router.get('/', (req, res) => {
  if (req.user) {
    return res.render('home',  {
      user: {
        firstName: req.user.firstName,
      },
    });
  }
  res.render('home');
});

module.exports = router;
