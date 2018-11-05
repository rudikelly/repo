'use strict';

require('dotenv').load();
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const User = require('./models/user');
const userRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
const debRouter = require('./routes/debs');

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
app.use(morgan('dev'));
app.use(helmet);
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

app.use(indexRouter);
app.use(userRouter);
app.use(uploadRouter);
app.use(debRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
