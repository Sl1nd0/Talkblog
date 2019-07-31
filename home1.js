const pg = require('pg');
//Require Express...
var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app);

var quer = require('./queries');

var file = require('fs');

const mustacheExpress = require('mustache-express');

app.use(express.static(__dirname + '/views/public'));

app.use(require('body-parser')());

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


const pool = new pg.Pool({

  user: 'sli',
  host:'127.0.0.1',
  database:'testDB4',
  password:'@Sli2354',
  port:'5432'

});

function homePage(req, res) {
    quer.
    res.render('home');
}

app.get('/', function(req, res) {
  homePage(req, res);
});



app.set('port', process.env.PORT||3000);

app.listen(app.get('port'), function() {
  console.log('Express started on http:// local host:' + 
  app.get('port') + 'press C-trl C to terminate!');
  pool.connect();
}); 