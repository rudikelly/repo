'use strict';

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const execFile = require('child_process').execFile;

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('static'));

function refreshPackages() {
  var filePath = path.join(process.cwd(), "scan.py")
  execFile(filePath, ["static/debs", "static"], function(err){
    if (err) console.log(err);
  });
}

app.get('/', (req, res) => {
  res.render('home', {title: "Home"});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
