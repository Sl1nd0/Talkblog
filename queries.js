var express = require('express'),
  app = express();

function select1 (table, param1) {

    var queryR = "select ";
    queryR += param1.toString();
    queryR += " From ";
    queryR += table;
    console.log('home1 is me');
}
  
module.exports = app;