const express = require('express');

const router = express.Router();

router.get('/deb/:deb', (req, res) => {
  const deb = req.params.deb;
  res.sendFile(deb, {root: './deb'}, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        res.sendStatus(404);
      } else {
        throw err;
      }
    }
  });
});

module.exports = router;
