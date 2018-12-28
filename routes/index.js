'use strict';

const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.userId) {
    User.findOne({_id: req.session.userId}, (err, user) => {
      if (err) throw err;
      res.render('home',  {
        user: {
          firstName: user.firstName,
        },
      });
    });
  }
  else {
    res.render('home');
  }
});

module.exports = router;
