const express = require('express');
const multer = require('multer');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: function(req, file, cb) {
    var extCheck = file.originalname.split('.').slice(-1)[0] == 'deb';
    var mimeCheck = file.mimetype == 'application/octet-stream';
    if (extCheck && mimeCheck) {
      return cb(null, true);
    }
    cb(null, false);
  },
});

router.get('/upload', (req, res) => {
  res.render('upload', {title: 'Upload'});
});

router.post('/upload', upload.single('deb'), (req, res) => {
  if (req.file == null) {
    res.send('invalid file');
  } else {
    res.send('received: ' + req.file.originalname);
  }
});

module.exports = router;
