'use strict';

const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.get('*', (req, res, next) => {
  if (req.session.userId) {
    User.findOne({_id: req.session.userId}, (err, user) => {
      if (err) throw err;
      req.user = user;
      next();
    });
  } else next();
});

module.exports = router;
