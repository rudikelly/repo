'use strict';

const express = require('express');
const exphbs = require('express-handlebars');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.render('home', {title: "Home"});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
