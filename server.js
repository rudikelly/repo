'use strict';

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const execFile = require('child_process').execFile;
const multer = require('multer');
const session = require('express-session');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('static'));

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  }),
  fileFilter: function(req, file, cb) {
    var extCheck = file.originalname.split('.').slice(-1)[0] == 'deb';
    var mimeCheck = file.mimetype == 'application/octet-stream';
    if (extCheck && mimeCheck) {
      return cb(null, true);
    }
    cb(null, false);
  }
});

function refreshPackages() {
  var filePath = path.join(process.cwd(), 'scan.py');
  execFile(filePath, ['--dir', 'static/debs', '-o', 'static'], function(err){
    if (err) console.log(err);
  });
}

app.get('/', (req, res) => {
  res.render('home', {title: 'Home'});
});

app.get('/signup', (req, res) => {
  res.render('signup', {title: 'Sign Up'});
});

app.get('/upload', (req, res) => {
  res.render('upload', {title: 'Upload'});
});

app.post('/upload', upload.single('deb'), (req, res) => {
  if (req.file == null) {
    res.send('invalid file');
  } else {
    res.send('received: ' + req.file.originalname);
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
