const pg = require('pg');

var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app);

var file = require('fs');

//mustache-express  
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

//WaitForTrigger();

/*function WaitForTrigger(){

	setTimeout(function() {
		main(req, res,  function() {
            console.log('Done with notifications');
            return WaitForTrigger();
        });
    }, 5000);
    
} /* WaitForTrigger */

function main(req, res, callback) 
{
    var notifications1 = "Select * FROM postnotify";
    pool.query(
        notifications1, (err2, qres1) => { //q2
        
        console.log(qres1);
        //res.render('index');
        console.log(' **** 1 **** ')
      
        return callback();
    });
}

app.get('/',function(req,res){
    
    main(req, res, function() {
        setTimeout(function() {
        console.log('Done with notifications');
        //return WaitForTrigger();
    }, 5000);
    });

});

app.set('port', process.env.PORT||4000);

app.listen(app.get('port'), function() {
  console.log('Express started on http:// local host:' + 
  app.get('port') + 'press C-trl C to terminate!');
  pool.connect();
}); 
