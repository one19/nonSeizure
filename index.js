var express = require('express'),
  fs = require('fs'),
  engines = require('consolidate'),
  ejs = require('ejs');


var app = express();
var pics = [];

app.engine('ejs', engines.ejs)
app.set('view engine', 'ejs');
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/pics', express.static(__dirname + '/pics'));

app.get('/', function(req, res) {
  //res.send('Hello world!');

  fs.readdir('pics', function(err, list) {
    if (err) throw err;
    pics = list;
  });
  res.render('index', {pics: pics});
  
});

var server = app.listen(3002, function() {
  console.log('Server running at http://localhost:' + server.address().port)
});

module.exports = app;