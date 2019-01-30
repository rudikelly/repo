'use strict';

const express = require('express');
const multer = require('multer');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    var extCheck = file.originalname.split('.').slice(-1)[0] == 'deb';
    var mimeCheck = file.mimetype == 'application/octet-stream';
    if (extCheck && mimeCheck) {
      return cb(null, true);
    }
    cb(null, false);
  },
});

/**
 * GET /upload
 * Upload page.
 */
router.get('/upload', (req, res) => {
  if (req.user) {
    return res.render('upload', {
      user: {
        firstname: req.user.firstname,
      },
    });
  }
  res.render('upload');
});

/**
 * POST /upload
 * Endpoint for uploading .deb packages.
 */
router.post('/upload', upload.single('deb'), (req, res) => {
  if (req.file == null) {
    return res.send('invalid file');
  }
  res.send('received: ' + req.file.originalname);
});

module.exports = router;
