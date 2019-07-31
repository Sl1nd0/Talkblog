var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app);

var file = require('fs');
//Profile stuff
var notifyQ = require('Queries/notifications');
var deleteQ = require('Queries/delete');

var cbutton = '';

var maincomment = '';
var mainInd = 0;
var mainname = '';
var mainID = 0;
var anamev = '';
var likeCount = 0;
var mylikes = '';
var searchPI = 0;
var searchVar = '';

var postText1 = [];
var postname1 = [];
var postTot = 0;
var searchComInd = 0;
var parInd = 0;
var mNotifications1 = "";
var mNotifications2 = "";
//mustache-express  
const mustacheExpress = require('mustache-express');

app.use(express.static(__dirname + '/views/public'));
app.use(express.static(__dirname + '/views/public2'));
app.use(express.static(__dirname + '/views/public3'));

app.use(require('body-parser')());

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


const pg = require('pg');

const pool = new pg.Pool({

  user: 'sli',
  host:'127.0.0.1',
  database:'testDB4',
  password:'@Sli2354',
  port:'5432'

});

function startPage(req, res) {

    pool.query(
        ' SELECT * FROM postdetails ', (err42, qres42) => {
        console.log(qres42 + " ---- ");

        displayOneByOne(qres42, 0, function() {
            console.log("I'm done with you man!");
        });
        res.render('home');
    });
    //
}

function displayOneByOne(Items, index, callback) {

    if (index >= Items.rowCount) {
        return callback();
    }

    if (Items.rows[index].posttext == 'Mara jeso!') {
        console.log(' NDAYTHOLA!! ' );
    }

    console.log(Items.rows[index].posttext + ' index --> ' + index);
    index++;
    return displayOneByOne(Items, index, callback);
}
///////////////////////////////////4000//////////////////////////////////////
app.get('/', function(req, res) {
    startPage(req, res);
   // life1();
});

app.set('port', process.env.PORT||4000);

app.listen(app.get('port'), function() {
  console.log('Express started on http:// local host:' + 
  app.get('port') + 'press C-trl C to terminate!');
  pool.connect();
}); 