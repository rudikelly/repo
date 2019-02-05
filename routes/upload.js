'use strict';

const express = require('express');
const multer = require('multer');
const dpkg = require('dpkgjs');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
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
    return res.render('upload/package', {
      user: {
        firstname: req.user.firstname,
      },
    });
  }
  res.render('upload/package');
});

/**
 * POST /upload
 * Endpoint for uploading .deb packages.
 */
router.post('/upload', upload.single('deb'), (req, res) => {
  if (req.file == null) {
    return res.render('upload/package', {
      error: 'Invalid package',
    });
  }
  const fileData = req.file.buffer;
  dpkg.getControlFromFile(fileData, (controlData) => {
    if (!controlData) {
      res.render('upload/package', {
        error: 'Invalid package',
      });
    }
    res.render('upload/packagedata', {
      package: {
        bundleid: controlData.Package,
        description: controlData.Description,
        maintainer: controlData.Maintainer,
        author: controlData.Author,
        section: controlData.Section,
        version: controlData.Version,
      },
    });
  });
});

module.exports = router;
