'use strict';

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const execFile = require('child_process').execFile;
const multer = require('multer');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const User = require('./models/user');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://localhost/repo', {
  useNewUrlParser: true,
  useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(express.static('static'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'aYhjO?Qx/Pp)WwvBxl?',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

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

app.post('/signup', (req, res) => {
  if (req.body.firstName &&
      req.body.lastName &&
      req.body.email &&
      req.body.password) {

    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    };

    User.create(userData, function (error, user) {
      if (error) {
        throw error;
      } else {
        req.session.userId = user._id;
        return res.send('signed in as ' + user.firstName);
      }
    });
  }
});

app.get('/signin', (req, res) => {
  res.render('signin', {title: 'Sign In'});
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
