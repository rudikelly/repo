'use strict';

const express = require('express');

const router = express.Router();

router.get('/deb/:deb', (req, res) => {
  const deb = req.params.deb;
  res.sendFile(deb, {root: './deb'}, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        return res.sendStatus(404);
      } else {
        throw err;
      }
    }
  });
  const reqData = {
    machine: req.headers['x-machine'],
    firmware: req.headers['x-firmware'],
    uuid: req.headers['x-unique-id'],
    ua: req.headers['user-agent'],
  };
});

module.exports = router;
