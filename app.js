//Require Express...
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

var q = "'";
var qc = "',";
var typeN = 5;
var typeN2 = 5;

/*********************** Queries *******************/

var queryLike = "SELECT  B.posttext, B.POSTID, A.USERNAME, A.USERID, ";
queryLike += " COUNT(POSTLIKERID) AS LIKES ";
queryLike += " FROM ACCOUNT A RIGHT JOIN POSTDETAILS B ON A.USERID = B.USERID ";
queryLike += " LEFT JOIN POSTLIKES C ON B.POSTID = C.POSTID ";
queryLike += " GROUP BY B.POSTID, A.USERID ";
queryLike += " ORDER BY B.POSTDATE DESC ";

var queryTest = "SELECT * FROM ACCOUNT A INNER JOIN POSTDETAILS B ON A.USERID = B.USERID ORDER BY B.postdate DESC";
//queryTest += "slindo'";

/*********************** Queries *******************/

var tVar = '';
var qVar = '';

var uEmail = '';
var uPass = '';
var uId;

function startPage(req, res) {
  res.render('home');
}

function createAccount(req, res) {
  res.render('create');
}

function confirmAccount(req, res) {

   var name1 = req.body.nam1;
   var sur1 = req.body.sur1;
   var bdate1 = req.body.bdate;
   var email1 = req.body.email;
   var number1 = req.body.number;
   var password1 = req.body.pas1;
   var cpassword1 = req.body.pas2;

  if (password1 == cpassword1) {
    //QUERY 1
    var insertQ1 = "Insert INTO account";
    insertQ1 += "(username, usersurname, useremail, accnumber, birthdate, apass)";
    insertQ1 += " Values (";
    insertQ1 += q + name1 + qc;
    insertQ1 += q + sur1 + qc;
    insertQ1 += q;
    insertQ1 += email1+ qc;
    insertQ1 += q;
    insertQ1 += number1 + qc;
    insertQ1 += q;
    insertQ1 += bdate1 + qc;
    insertQ1 += q;
    insertQ1 += password1;
    insertQ1 += q;
    insertQ1 +=");";

    var insertQ2 = "Insert INTO profiletalk";
    insertQ2 += "(userID)"; 
    insertQ2 += "SELECT userID FROM account WHERE useremail LIKE '%";
    insertQ2 += email1 + "%" + q;
    insertQ2 += " and apass LIKE '%";
    insertQ2 += password1 + "%" +  q;
     pool.query(
        insertQ1, (err1, qres1) => {  //q1
            //pool.end();
            pool.query(
              insertQ2, (err2, qres1) => { //q2

            console.log(insertQ1 + "\n\n");
            if (!err1 && !err2) {
              res.render('comfirm', {aName: name1});
            } else {
              res.render('create');
            }

          });
        });

  } else { 
    res.render('create');
  }
}

function loginAccount(req, res) {
res.render('login');
}

function homePage(req, res) {

  var lemail1 = req.body.formN.toString();
  var passw1 = req.body.formP.toString();

  console.log(" ag " + lemail1 + " p " + passw1);

  var queTest = "SELECT * FROM ";
  queTest += "ACCOUNT WHERE Lower(useremail) LIKE '%";
  queTest += lemail1.toLowerCase() + "%' ";
  queTest += " AND apass LIKE '%";
  queTest += passw1 + "%' ";

  pool.query(
    queTest, (err1, qres1) => {
    // console.log(qres1 + " hr qres");
    anamev = qres1.rows[qres1.rowCount - 1].username;
      //I NEED TO MAKE A RONG PASSWORD CHECKER HERE ...........

      if (!err1) {
        
        uId = qres1.rows[0].userid;

        console.log( "My ID " + uId.toString());
        //query test is banned for nothing has been posted yet!!
        pool.query(
          queryLike, (err, qres12) => {
         // tVar = qres1.rows[0].posttext;
          
          if (!err) {
           console.log(qres12.rowCount + "  111 dd");
        for (var i = 0; i < qres12.rowCount; i++) {
          mylikes = qres12.rows[i].likes.toString();
          if (i == 0)
          {
          tVar +="<section class= 'newer' id='newer'>";
          tVar += "";
          tVar += "<div class='card mb-4'>";
          tVar += "<div class='card-body'>";
          tVar += "<h2 class='card-title'>";
          tVar += qres12.rows[i].username.toString();
          tVar += "</h2>";
          tVar += "<p  class='card-text' id = 'p";
          tVar += i.toString() + "'>";
          tVar += qres12.rows[i].posttext.toString();
          tVar += "</p>";
          tVar += " <button formaction = '/comment' class='btn btn-primary' name = 'bt";
          tVar += i.toString() + "'";
          tVar += "id = '";
          tVar += i.toString() + "'";
          tVar += "> reply </button> ";
          tVar += "<button formaction = '/like' class='btn btn-primary' ";
          tVar += "id = 'btn' name = 'btn";
          tVar += i.toString() + "'";
          tVar += "> Like </button> ";
          tVar += " <b> " + mylikes + " </b>";
          tVar += "</div> </div> ";
          tVar += "</section>";
          } else if (i == qres12.rowCount - 1) {
          tVar +="<section class= 'Older' id='Older'>";
          tVar += "";
          tVar += "<div class='card mb-4'>";
          tVar += "<div class='card-body'>";
          tVar += "<h2 class='card-title'>";
          tVar += qres12.rows[i].username.toString();
          tVar += "</h2>";
          tVar += "<p  class='card-text' id = 'p";
          tVar += i.toString() + "'>";
          tVar += qres12.rows[i].posttext.toString();
          tVar += "</p>";
          tVar += "<button formaction = '/comment' class='btn btn-primary' name = 'bt";
          tVar += i.toString() + "'";
          tVar += "id = '";
          tVar += i.toString() + "'";
          tVar += "> reply </button> ";
          tVar += "<button formaction = '/like' class='btn btn-primary' ";
          tVar += "id = 'btn' name = 'btn";
          tVar += i.toString() + "'";
          tVar += "> Like </button>";
          tVar += " <b> " +  mylikes + " </b> ";
          tVar += "</div> </div> ";
          tVar += "</section>";
          } else {
          tVar += "";
          tVar += "<div class='card mb-4'>";
          tVar += "<div class='card-body'>";
          tVar += "<h2 class='card-title'>";
          tVar += qres12.rows[i].username.toString();
          tVar += "</h2>";
          tVar += "<p  class='card-text' id = 'p";
          tVar += i.toString() + "'>";
          tVar += qres12.rows[i].posttext.toString();
          tVar += "</p>";
          tVar += "<button formaction = '/comment' class='btn btn-primary' name = 'bt";
          tVar += i.toString() + "'";
          tVar += "id = '";
          tVar += i.toString() + "'";
          tVar += " > reply </button> ";
          tVar += "<button formaction = '/like' class='btn btn-primary' ";
          tVar += "id = 'btn' name = 'btn";
          tVar += i.toString() + "'";
          tVar += "> Like </button>";
          tVar += " <b>" + mylikes + "</b>";
          tVar += "</div> </div> ";
          }
        }
      }

      if (tVar != '') {
        qVar = "<ul class='pagination justify-content-center mb-4'>";
        qVar += "<li class='page-item'>";
        qVar += "<a class='page-link' href='#newer'>&larr; Newer</a>";
        qVar +=  "</li> <li class='page-item'> <a class='page-link' href='#Older'>Older &rarr;</a>";
        qVar += "</li> </ul>";
        } else {
          qVar = '';
        }
  
          console.log(tVar);
          res.render('index', {temp1: tVar, page1: qVar, aName : anamev});
      });

      } else {
        res.render('login');
      }

    });
  
  }


function homePage2(req, res)
{

  var tVar = '';
  var qVar = '';

  pool.query(
    queryLike, (err, qres12) => {
   // tVar = qres1.rows[0].posttext;
    
    if (!err) {
     console.log(qres12.rowCount + "  111 dd");
  for (var i = 0; i < qres12.rowCount; i++) {
    mylikes = qres12.rows[i].likes.toString();
    if (i == 0)
    {
    tVar +="<section class= 'newer' id='newer'>";
    tVar += "";
    tVar += "<div class='card mb-4'>";
    tVar += "<div class='card-body'>";
    tVar += "<h2 class='card-title'>";
    tVar += qres12.rows[i].username;
    tVar += "</h2>";
    tVar += "<p  class='card-text' id = 'p";
    tVar += i.toString() + "'>";
    tVar += qres12.rows[i].posttext;
    tVar += "</p>";
    tVar += " <button formaction = '/comment' class='btn btn-primary' name = 'bt";
    tVar += i.toString() + "'";
    tVar += "id = '";
    tVar += i.toString() + "'";
    tVar += "> reply </button> ";
    tVar += "<button formaction = '/like' class='btn btn-primary' ";
    tVar += "id = 'btn' name = 'btn";
    tVar += i.toString() + "'";
    tVar += "> Like </button>";
    tVar += " <b>" + mylikes + " </b>";
    tVar += "</div> </div> ";
    tVar += "</section>";
    } else if (i == qres12.rowCount - 1) {
    tVar +="<section class= 'Older' id='Older'>";
    tVar += "";
    tVar += "<div class='card mb-4'>";
    tVar += "<div class='card-body'>";
    tVar += "<h2 class='card-title'>";
    tVar += qres12.rows[i].username;
    tVar += "</h2>";
    tVar += "<p  class='card-text' id = 'p";
    tVar += i.toString() + "'>";
    tVar += qres12.rows[i].posttext;
    tVar += "</p>";
    tVar += "<button formaction = '/comment' class='btn btn-primary' name = 'bt";
    tVar += i.toString() + "'";
    tVar += "id = '";
    tVar += i.toString() + "'";
    tVar += "> reply </button> ";
    tVar += "<button formaction = '/like' class='btn btn-primary' ";
    tVar += "id = 'btn' name = 'btn";
    tVar += i.toString() + "'";
    tVar += "> Like </button>";
    tVar += " <b>" + mylikes + " </b>";
    tVar += "</div> </div> ";
    tVar += "</section>";
    } else {
    tVar += "";
    tVar += "<div class='card mb-4'>";
    tVar += "<div class='card-body'>";
    tVar += "<h2 class='card-title'>";
    tVar += qres12.rows[i].username;
    tVar += "</h2>";
    tVar += "<p  class='card-text' id = 'p";
    tVar += i.toString() + "'>";
    tVar += qres12.rows[i].posttext;
    tVar += "</p>";
    tVar += "<button formaction = '/comment' class='btn btn-primary' name = 'bt";
    tVar += i.toString() + "'";
    tVar += "id = '";
    tVar += i.toString() + "'";
    tVar += " > reply </button> ";
    tVar += "<button formaction = '/like' class='btn btn-primary' ";
    tVar += "id = 'btn' name = 'btn";
    tVar += i.toString() + "'";
    tVar += "> Like </button>";
    tVar += " <b>" + mylikes + " </b>";
    tVar += "</div> </div> ";
    }
    
  }
}

if (tVar != '') {
  qVar = "<ul class='pagination justify-content-center mb-4'>";
  qVar += "<li class='page-item'>";
  qVar += "<a class='page-link' href='#newer'>&larr; Newer</a>";
  qVar +=  "</li> <li class='page-item'> <a class='page-link' href='#Older'>Older &rarr;</a>";
  qVar += "</li> </ul>";
  } else {
    qVar = '';
  }

    console.log(tVar);
    res.render('index', {temp1: tVar, page1: qVar, aName : anamev});
});

}

function commentPage(req, res) {
  
var queryTest1 = "SELECT * FROM ACCOUNT A INNER JOIN POSTDETAILS B ON A.USERID = B.USERID ORDER BY B.postdate DESC";
var comMake = '';
var comMake2 = '';
var aInd = 0;

//console.log(req.(req.param(act[i]))
//console.log( '2nd time but 5 ' +  req.param('bt5'));

pool.query(
  //queryTest1, (err, qres1) => {
  queryLike, (err, qres1) => {
  for (var i = 0; i < qres1.rowCount; i++) {

    mylikes =  qres1.rows[i].likes.toString();
    // console.log(" Celebrity " + req.param('bt' + i.toString()));
    if (req.param('bt' + i.toString()) != undefined) 
    {
        typeN2 = 1;
        aInd = i;
       // console.log(req.body.bt1);
        //  console.log(qres1.rows[i].posttext.replace(/\s/g,' '));
    maincomment = qres1.rows[i].posttext;
    mainID = qres1.rows[i].postid;

    mainInd = i;
    mainname = qres1.rows[i].username;

    comMake += "";
    comMake += "<div class='card mb-4'>";
    comMake += "<div class='card-body'>";
    comMake += "<h2 class='card-title'>";
    comMake += qres1.rows[i].username;
    comMake += "</h2>";
    comMake += "<p  class='card-text' id = 'p";
    comMake += i.toString() + "'>";
    comMake += qres1.rows[i].posttext;
    comMake += "</p>";
    comMake += "</br></br><textarea rows='5' cols='80' name = 'commentsection'> </textarea ></br>";
    comMake += "<button formaction = '/postcomment' class='btn btn-primary' name = 'bt";
    comMake += i.toString() + "' ";
    comMake += "id = '";
    comMake += i.toString() + "'";
    comMake += " > reply </button> ";
    comMake += "<button formaction = '/like' class='btn btn-primary' ";
    comMake += "id = 'btn' name = 'btn";
    comMake += i.toString() + "'";
    comMake += "> Like </button>";
    comMake += " <b>" + mylikes + " </b>";
    comMake += "</div> </div> ";
    console.log(' iii ' + i);
    mNotifications2 = notifyQ(mainID, uId, typeN2);
    console.log(mNotifications2 + "*****");
      }
    }

    for (var j = 0; j < qres1.rowCount;) 
    {
       mylikes =  qres1.rows[j].likes;
      if (j == aInd) {
       j++; 
      } else {
     // comMake2 += comMake;
      comMake += "";
      comMake += "<div class='card mb-4'>";
      comMake += "<div class='card-body'>";
      comMake += "<h2 class='card-title'>";
      comMake += qres1.rows[j].username;
      comMake += "</h2>";
      comMake += "<p  class='card-text' id = 'p";
      comMake += j.toString() + "'>";
      comMake += qres1.rows[j].posttext;
      comMake += "</p>";

      comMake += "<button formaction = '/comment' class='btn btn-primary' name = 'bt";
      comMake += j.toString() + "'";
      comMake += "id = '";
      comMake += j.toString() + "'";
      comMake += " > reply </button> ";
      comMake += "<button formaction = '/like' class='btn btn-primary' ";
      comMake += "id = 'btn' name = 'btn";
      comMake += j.toString() + "'";
      comMake += "> Like </button>";
      comMake += " <b>" + mylikes.toString() + " </b>";
      comMake += "</div> </div> "; 
      j++;
     }
    }

    if (comMake != '') {
      qVar2 = "<ul class='pagination justify-content-center mb-4'>";
      qVar2 += "<li class='page-item'>";
      qVar2 += "<a class='page-link' href='#newer'>&larr; Newer</a>";
      qVar2 +=  "</li> <li class='page-item'> <a class='page-link' href='#Older'>Older &rarr;</a>";
      qVar2 += "</li> </ul>";
      } else {
        qVar2 = '';
      }

    res.render('index', {temp1: comMake, page1: qVar2, aName : anamev});

  });

  //I haven't catered yet for taking the comment into the database .....
}

function postComment(req, res) {

  var postm = maincomment;

  console.log(req.body.commentsection + "   TADDA! " + " PPPOST " + postm  + " Date " + mainID + ' - 1 JA'); //mainname
  var tVar = '';
  var bVar = '';
  
/*
  tVar += "";
      tVar += "<div class='card mb-4'>";
      tVar += "<div class='card-body'>";
      tVar += "<h2 class='card-title'>";
      tVar += mainname;
      tVar += "</h2>";
      tVar += "<p  class='card-text' id = 'p";
      tVar += mainInd.toString() + "'>";
      tVar += maincomment;
      tVar += "</p>";

      tVar += "<button formaction = '/comment' class='btn btn-primary' name = 'bt";
      tVar += mainInd.toString() + "'";
      tVar += "id = '";
      tVar += mainInd.toString() + "'";
      tVar += " > reply </button> ";
      tVar += "<button class='btn btn-primary' ";
      tVar += "id = 'btn";
      tVar += mainInd.toString() + "'";
      tVar += "> Like </button>";
      tVar += "<br><br>  <h3> SLINDOS </h3> <p> hhhere </p>  </div> </div> "; 
*/
var queryLike1 = "SELECT  B.posttext, B.POSTID, A.USERNAME, A.USERID, ";
queryLike1 += " COUNT(POSTLIKERID) AS LIKES ";
queryLike1 += " FROM ACCOUNT A RIGHT JOIN POSTDETAILS B ON A.USERID = B.USERID ";
queryLike1 += " LEFT JOIN POSTLIKES C ON B.POSTID = C.POSTID ";
queryLike1 += " WHERE B.POSTID = ";
queryLike1 += mainID;
queryLike1 += " GROUP BY B.POSTID, A.USERID ";
queryLike1 += " ORDER BY B.POSTDATE DESC ";

var querT = "SELECT * FROM POSTDETAILS WHERE POSTTEXT LIKE '%";
    querT += postm + "%' AND postid = ";
    querT += mainID.toString();


    var querT2 = "SELECT * FROM postComments WHERE postID = ";
    querT2 += mainID.toString();
    querT2 += " ORDER BY postCommentDate DESC ";

    var qerTJ = "SELECT * "; 
    qerTJ += "FROM POSTCOMMENTS A ";
    qerTJ += " INNER JOIN ACCOUNT B ON ";
    qerTJ += " A.POSTCOMMMENTERID = B.USERID ";
    qerTJ += " WHERE A.POSTID = ";
    qerTJ += mainID.toString();
    qerTJ += " ORDER BY A.POSTCOMMENTDATE DESC ";

    var insertQT = "Insert INTO postComments(pcomments, postCommentDate, postCommmenterID, postID) VALUES ";
        insertQT += " ('";
        insertQT += req.body.commentsection;
        insertQT += "', ";
        insertQT += "'NOW()', ";
        insertQT += "'";
        insertQT += uId.toString() + "', ";
        insertQT += "'";
        insertQT += mainID.toString() + "'";
        insertQT += ")";

    console.log( querT  + ' uid ' + uId.toString());

    pool.query(
      insertQT, (err1, qres11) => {

    pool.query(
      querT, (err, qres1) => {
         
         pool.query(
          queryLike1, (errL, qres1L) => {

        pool.query(
          qerTJ, (err2, qres2) => {
        //console.log(qres1.rows[0].posttext + " From qq");
        tVar += "";
        tVar += "<div class='card mb-4'>";
        tVar += "<div class='card-body'>";
        tVar += "<h2 class='card-title'>";
        tVar += qres2.rows[qres2.rowCount - 1].username;
        tVar += "</h2>";
        tVar += "<p  class='card-text' id = 'p";
        tVar += mainInd.toString() + "'>";
        tVar += qres1.rows[qres1.rowCount - 1].posttext.toString();
        tVar += "</p>";
  
        tVar += "<button formaction = '/comment' class='btn btn-primary' name = 'bt";
        tVar += mainInd.toString() + "' ";
        tVar += " id = '";
        tVar += mainInd.toString() + "'";
        tVar += " > reply </button> ";
        tVar += "<button formaction = '/like' class='btn btn-primary' ";
        tVar += "id = 'btn' name = 'btn";
        tVar += mainInd.toString() + "'";
        tVar += "> Like </button> ";
        tVar += " <b>" + qres1L.rows[0].likes.toString() + " </b>";
        tVar += " <br> <br> ";
       
        for (var i = 0; i < qres2.rowCount; i++) {
        tVar += "<h3>";
        tVar += qres2.rows[i].username + " </h3>";
        tVar +=" <p> ";
        tVar += qres2.rows[i].pcomments + "</p>";   //--comment section ...
        }

        tVar += "</div> </div>";  
       /*
        pool.query(
          querT2, (err1, qres2) => {
            
          });*/
         
        pool.query(
        mNotifications2, (errN, resN) => {

        res.render('index', {temp1: tVar, aName: anamev});
        
        });
      });
     });
    });
  });


}

function postPage(req, res)
{
  //var queryTest1 = "SELECT * FROM talkblog Order By pdate DESC";

  var postIT = "<h1 class='my-4'>";
  postIT += "<div class='container'>";
  postIT += "<textarea class='form-control' type = 'text' rows='6' name = 'posta' id='comment'>";
  postIT += "</textarea>";  
  postIT += "<input formaction = 'postP' class='btn btn-primary' type = 'submit' value = 'POST' name = 'POST' >  </a>";
  postIT += "</div>";
  postIT += "</h1>";

  res.render('index', {newpost: postIT, page1: ''});

}

function postPosted(req, res) {
 
  var tVar = '';

  console.log(req.body.posta);

  var myPost = req.body.posta.replace(/\s/g,' ');
  console.log(uId + " yami");

  var insertQ3 = "INSERT INTO POSTDETAILS (userID, posttext, postDate) VALUES ('";
  insertQ3 += uId.toString();
  insertQ3 += "', '";
  insertQ3 += myPost;
  insertQ3 +=  "', '";
  insertQ3 += "NOW()'";
  insertQ3 += ");";

  pool.query(
    insertQ3, (err2, qres22) => {
        console.log(qres22);
        if (!err2) {
          console.log("SUCCESSFUL!");

    pool.query(
    queryLike, (err, qres12) => {
   // tVar = qres1.rows[0].posttext;

   //  console.log(qres12.rowCount + "dd");
  for (var i = 0; i < qres12.rowCount; i++) {

    mylikes = qres12.rows[i].likes;

    if (i == 0)
    {
    tVar +="<section class= 'newer' id='newer'>";
    tVar += "";
    tVar += "<div class='card mb-4'>";
    tVar += "<div class='card-body'>";
    tVar += "<h2 class='card-title'>";
    tVar += qres12.rows[i].username;
    tVar += "</h2>";
    tVar += "<p  class='card-text' id = 'p";
    tVar += i.toString() + "'>";
    tVar += qres12.rows[i].posttext;
    tVar += "</p>";
    tVar += "<button class='btn btn-primary' name = 'bt";
    tVar += i.toString() + "'";
    tVar += "id = '";
    tVar += i.toString() + "'";
    tVar += "> reply </button> ";
    tVar += "<button formaction = '/like' class='btn btn-primary' ";
    tVar += "id = 'btn' name = 'btn";
    tVar += i.toString() + "'";
    tVar += "> Like </button>";
    tVar += " <b>" + mylikes + " </b>";
    tVar += "</div> </div> ";
    tVar += "</section>";
    } else if (i == qres12.rowCount - 1) {
    tVar +="<section class= 'Older' id='Older'>";
    tVar += "";
    tVar += "<div class='card mb-4'>";
    tVar += "<div class='card-body'>";
    tVar += "<h2 class='card-title'>";
    tVar += qres12.rows[i].username;
    tVar += "</h2>";
    tVar += "<p  class='card-text' id = 'p";
    tVar += i.toString() + "'>";
    tVar += qres12.rows[i].posttext;
    tVar += "</p>";
    tVar += "<button class='btn btn-primary' name = 'bt";
    tVar += i.toString() + "'";
    tVar += "id = '";
    tVar += i.toString() + "'";
    tVar += "> reply </button> ";
    tVar += "<button formaction = '/like' class='btn btn-primary' ";
    tVar += "id = 'btn' name = 'btn";
    tVar += i.toString() + "'";
    tVar += "> Like </button>";
    tVar += " <b>" + mylikes + " </b>";
    tVar += "</div> </div> ";
    tVar += "</section>";
    } else {
    tVar += "";
    tVar += "<div class='card mb-4'>";
    tVar += "<div class='card-body'>";
    tVar += "<h2 class='card-title'>";
    tVar += qres12.rows[i].username;
    tVar += "</h2>";
    tVar += "<p  class='card-text' id = 'p";
    tVar += i.toString() + "'>";
    tVar += qres12.rows[i].posttext;
    tVar += "</p>";
    tVar += "<button class='btn btn-primary' name = 'bt";
    tVar += i.toString() + "'";
    tVar += "id = '";
    tVar += i.toString() + "'";
    tVar += " > reply </button> ";
    tVar += "<button class='btn btn-primary' ";
    tVar += "id = 'btn' formaction = '/like' name = 'btn";
    tVar += i.toString() + "'";
    tVar += "> Like </button>";
    tVar += " <b>" + mylikes + " </b>";
    tVar += "</div> </div> ";
    }
    
  }


if (tVar != '') {
  qVar = "<ul class='pagination justify-content-center mb-4'>";
  qVar += "<li class='page-item'>";
  qVar += "<a class='page-link' href='#newer'>&larr; Newer</a>";
  qVar +=  "</li> <li class='page-item'> <a class='page-link' href='#Older'>Older &rarr;</a>";
  qVar += "</li> </ul>";
  } else {
    qVar = '';
  }

    console.log(tVar);
    res.render('index', {temp1: tVar, page1: qVar, aName: anamev});
});
        }
    });

}

function searchPage(req, res) {

 searchVar = req.body.searcha;

  var qVar = '';
  var tVar = '';


  var queryTT = "SELECT * FROM ACCOUNT A INNER JOIN POSTDETAILS B ON A.USERID = ";
  queryTT += "B.USERID ";
  queryTT += " ORDER BY B.postdate DESC "; 

queryTTR = "SELECT  B.posttext, B.POSTID, A.USERNAME, A.USERID, ";
queryTTR += " COUNT(POSTLIKERID) AS LIKES ";
queryTTR += " FROM ACCOUNT A right JOIN POSTDETAILS B ON A.USERID = B.USERID ";
queryTTR += " LEFT JOIN POSTLIKES C ON B.POSTID = C.POSTID ";
queryTTR += " WHERE posttext LIKE '%";
queryTTR += searchVar;
queryTTR += "%'";
queryTTR += " GROUP BY B.POSTID, A.USERID ";
queryTTR +=  " ORDER BY B.POSTDATE DESC ";


querySearch = queryTTR;

var rInd = 0;

  pool.query(
    queryTTR, (err2, qres12) => {

       for (var i = 0; i < qres12.rowCount; i++) {
        

        mylikes = qres12.rows[i].likes;
        if (i == 0)
        {
        tVar +="<section class= 'newer' id='newer'>";
        tVar += "";
        tVar += "<div class='card mb-4'>";
        tVar += "<div class='card-body'>";
        tVar += "<h2 class='card-title'>";
        tVar += qres12.rows[i].username;
        tVar += "</h2>";
        tVar += "<p  class='card-text' id = 'p";
        tVar += i.toString() + "'>";
        tVar += qres12.rows[i].posttext;
        tVar += "</p>";
        tVar += " <button formaction = '/commentS' class='btn btn-primary' name = 'bt";
        tVar += i.toString() + "' ";
        tVar += "id = '";
        tVar += rInd.toString() + "'";
        tVar += "> reply </button> ";
        tVar += "<button formaction = '/slike' class='btn btn-primary' ";
        tVar += "id = 'btn' name = 'btn";
        tVar += i.toString() + "'";
        tVar += "> Like </button>";
        tVar += " <b>" + mylikes.toString() + " </b>";
        tVar += "</div> </div> ";
        tVar += "</section>";
        } else if (i == qres12.rowCount - 1) {
        tVar +="<section class= 'Older' id='Older'>";
        tVar += "";
        tVar += "<div class='card mb-4'>";
        tVar += "<div class='card-body'>";
        tVar += "<h2 class='card-title'>";
        tVar += qres12.rows[i].username;
        tVar += "</h2>";
        tVar += "<p  class='card-text' id = 'p";
        tVar += i.toString() + "'>";
        tVar += qres12.rows[i].posttext;
        tVar += "</p>";
        tVar += "<button formaction = '/commentS' class='btn btn-primary' name = 'bt";
        tVar += i.toString() + "' ";
        tVar += "id = '";
        tVar += rInd.toString() + "'";
        tVar += "> reply </button> ";
        tVar += "<button formaction = '/slike' class='btn btn-primary' ";
        tVar += "id = 'btn' name = 'btn";
        tVar += i.toString() + "'";
        tVar += "> Like </button>";
        tVar += " <b>" + mylikes.toString() + " </b>";
        tVar += "</div> </div> ";
        tVar += "</section>";
        } else {
        tVar += "";
        tVar += "<div class='card mb-4'>";
        tVar += "<div class='card-body'>";
        tVar += "<h2 class='card-title'>";
        tVar += qres12.rows[i].username;
        tVar += "</h2>";
        tVar += "<p  class='card-text' id = 'p";
        tVar += i.toString() + "'>";
        tVar += qres12.rows[i].posttext;
        tVar += "</p>";
        tVar += "<button formaction = '/commentS' class='btn btn-primary' name = 'bt";
        tVar += i.toString() + "' ";
        tVar += "id = '";
        tVar += rInd.toString() + "'";
        tVar += " > reply </button> ";
        tVar += "<button formaction = '/slike' class='btn btn-primary' ";
        tVar += "id = 'btn' name = 'btn";
        tVar += i.toString() + "'";
        tVar += "> Like </button>";
        tVar += " <b>" + mylikes.toString() + " </b>";
        tVar += "</div> </div> ";
        }

        //postM[i] = tVar;
        //postTot = qres12.rowCount;

      }

      
      //res.render('index');
      if (tVar != '') {
        qVar = "<ul class='pagination justify-content-center mb-4'>";
        qVar += "<li class='page-item'>";
        qVar += "<a class='page-link' href='#newer'>&larr; Newer</a>";
        qVar +=  "</li> <li class='page-item'> <a class='page-link' href='#Older'>Older &rarr;</a>";
        qVar += "</li> </ul>";
        } else {
        qVar = '';
        }

        //console.log(" HERE at SEARCH !");
        console.log(" HERE at SEARCH ! " + searchVar);
        res.render('index', {temp1: tVar, page1: qVar, aName : anamev});
    });
}

function searchLiker(req, res) {
// console.log(" Search " + searchVar);

var querySearch = "SELECT  B.posttext, B.POSTID, A.USERNAME, A.USERID, ";
querySearch += " COUNT(POSTLIKERID) AS LIKES ";
querySearch += " FROM ACCOUNT A right JOIN POSTDETAILS B ON A.USERID = B.USERID ";
querySearch += " LEFT JOIN POSTLIKES C ON B.POSTID = C.POSTID ";
querySearch += " WHERE posttext LIKE '%";
querySearch += searchVar;
querySearch += "%'";
querySearch += " GROUP BY B.POSTID, A.USERID ";
querySearch +=  " ORDER BY B.POSTDATE DESC ";

var cond1 = 5;
var lastQ = '';
var rInd = 0;

var postInd1 = 0;
var query1 = "SELECT * FROM POSTLIKES";
var insertQuery1 = '';

//change tVar to tVar2 SLI!

var tVar2 = '';
var pVar2 = '';

pool.query(
  querySearch, (err, qres)=> {
    for (var i = 0; i < qres.rowCount; i++) {
    if (req.param('btn' + i.toString()) != undefined) {

      console.log( 'btn' + i.toString() + "   Text " + qres.rows[i].posttext);
      postInd1 = qres.rows[i].postid;
      typeN = 0;
    }

  }

   
   pool.query(
    query1, (err1, qres1)=> {

      if (qres1.rowCount <= 0) {
        insertQuery1 = " INSERT INTO POSTLIKES(PLIKES, POSTLIKEDATE, POSTLIKERID, POSTID) ";
        insertQuery1 += " VALUES ( ";
        insertQuery1 += "'0',";
        insertQuery1 += " 'NOW()', '";
        insertQuery1 += uId.toString() + "', '";
        insertQuery1 += postInd1.toString() + "')";
      } else {
        insertQuery1 = "SELECT POSTLIKERID, PLIKES, POSTID, CASE ";
        insertQuery1 += " WHEN (POSTLIKERID = ";
        insertQuery1 += uId.toString();
        insertQuery1 += " AND PLIKES = 0 AND POSTID = ";
        insertQuery1 += postInd1.toString();
        insertQuery1 += ") THEN 0";
        insertQuery1 += " ELSE 2";
        insertQuery1 += " END AS STATLIKE ";
        insertQuery1 += "FROM POSTLIKES;";
      }

      var mInd1 = 0;

      pool.query(
        query1, (err2, qres3)=> {

          for (var i = 0; i < qres3.rowCount; i++) {

            if (qres3.rows[i].plikes == 0 && qres3.rows[i].postlikerid == uId && qres3.rows[i].postid == postInd1)
           {
             mInd1 = i;
           }
        }

        pool.query(
          insertQuery1, (err31, qres31)=> {

        if (qres31.command.toString() == 'SELECT')
         {
              console.log(qres31.rows[mInd1].statlike + " i like Status lena ke ");
              cond1 = qres31.rows[mInd1].statlike;
         }

         if (cond1 == 2) {

          lastQ = " INSERT INTO POSTLIKES(PLIKES, POSTLIKEDATE, POSTLIKERID, POSTID) ";
          lastQ += " VALUES ( ";
          lastQ += "'0',";
          lastQ += " 'NOW()', '";
          lastQ += uId.toString() + "', '";
          lastQ += postInd1.toString() + "')";

          mNotifications1 = notifyQ(postInd1, uId, typeN);
          pool.query(
            mNotifications1, (err42, qres42) => {
            console.log(qres42 + " ---- ");
          });

        } else if (cond1 == 0) {

          lastQ = "DELETE FROM POSTLIKES WHERE postId = ";
          lastQ += postInd1.toString() + " AND postlikerID = ";
          lastQ += uId.toString() + ";"; 

          mNotifications1 = deleteQ(postInd1, uId, typeN);
                pool.query(
                  mNotifications1, (err42, qres42) => {
                  //console.log(qres42 + " ---- ");
              });
          }

        pool.query(
          lastQ, (err11, qres11)=> {

            pool.query( // starts q
              querySearch, (err12, qres12) => {

                for (var i = 0; i < qres12.rowCount; i++) {
        

                  mylikes = qres12.rows[i].likes;
                  
                  
                  tVar2 += "";
                  tVar2 += "<div class='card mb-4'>";
                  tVar2 += "<div class='card-body'>";
                  tVar2 += "<h2 class='card-title'>";
                  tVar2 += qres12.rows[i].username;
                  tVar2 += "</h2>";
                  tVar2 += "<p  class='card-text' id = 'p";
                  tVar2 += i.toString() + "'>";
                  tVar2 += qres12.rows[i].posttext;
                  tVar2 += "</p>";
                  tVar2 += " <button formaction = '/commentS' class='btn btn-primary' name = 'bt";
                  tVar2 += i.toString() + "'";
                  tVar2 += " id = '";
                  tVar2 += i.toString() + "'";
                  tVar2 += "> reply </button> ";
                  tVar2 += "<button formaction = '/slike' class='btn btn-primary' ";
                  tVar2 += "id = 'btn' name = 'btn";
                  tVar2 += i.toString() + "'";
                  tVar2 += "> Like </button>";
                  tVar2 += " <b>" + mylikes.toString() + " </b>";
                  tVar2 += "</div> </div> ";
                  //postM[i] = tVar;
                  //postTot = qres12.rowCount;
               }
          
                
                //res.render('index');
                if (tVar != '') {
                  qVar2 = "<ul class='pagination justify-content-center mb-4'>";
                  qVar2 += "<li class='page-item'>";
                  qVar2 += "<a class='page-link' href='#newer'>&larr; Newer</a>";
                  qVar2 +=  "</li> <li class='page-item'> <a class='page-link' href='#Older'>Older &rarr;</a>";
                  qVar2 += "</li> </ul>";
                  } else {
                  qVar2 = '';
                  }
          
                  //console.log(" HERE at SEARCH !");
                  console.log(" HERE at SEARCH ! " + searchVar);
                  res.render('index', {temp1: tVar2, page1: qVar2, aName : anamev});

            });
          });

        }); 
        });

    });

  });

  //console.log("\n\n #### ");
}

function searchCommenter(req, res) {

var querySearch = "SELECT  B.posttext, B.POSTID, A.USERNAME, A.USERID, ";
querySearch += " COUNT(POSTLIKERID) AS LIKES ";
querySearch += " FROM ACCOUNT A right JOIN POSTDETAILS B ON A.USERID = B.USERID ";
querySearch += " LEFT JOIN POSTLIKES C ON B.POSTID = C.POSTID ";
querySearch += " WHERE posttext LIKE '%";
querySearch += searchVar;
querySearch += "%'";
querySearch += " GROUP BY B.POSTID, A.USERID ";
querySearch +=  " ORDER BY B.POSTDATE DESC ";


var tVar3 = '';
var tVarM = '';
var qVar = '';

pool.query(
  querySearch, (err1, res1) => {

    for (var i = 0; i < res1.rowCount; i++) {

      if (req.param('bt' + i.toString()) != undefined) {
        console.log('bt' + i.toString());
        console.log(res1.rows[i].posttext + ' MMMMMOOOOO');
                  mylikes = res1.rows[i].likes;
                  searchComInd = res1.rows[i].postid; 


                  parInd = i;
                  tVar3 = "";
                  tVar3 += "<div class='card mb-4'>";
                  tVar3 += "<div class='card-body'>";
                  tVar3 += "<h2 class='card-title'>";
                  tVar3 += res1.rows[i].username;
                  tVar3 += "</h2>";
                  tVar3 += "<p  class='card-text' id = 'p";
                  tVar3 += i.toString() + "'>";
                  tVar3 += res1.rows[i].posttext;
                  tVar3 += "</p>";
                  tVar3 +=  "</br></br><textarea rows='5' cols='80' name = 'commentsection'> </textarea ></br> "; 
                  tVar3 += " <button formaction = '/postcommentS' class='btn btn-primary' name = 'bt";
                  tVar3 += i.toString() + "'";
                  tVar3 += " id = ' ";
                  tVar3 += i.toString() + "'";
                  tVar3 += "> reply </button> ";
                  tVar3 += "<button formaction = '/slike' class='btn btn-primary' ";
                  tVar3 += "id = 'btn' name = 'btn";
                  tVar3 += i.toString() + "'";
                  tVar3 += "> Like </button>";
                  tVar3 += " <b>" + mylikes.toString() + " </b>";
                  tVar3 += " </div> </div> ";
                 // console.log(" my tvar " + tVarM);
                  typeN2 = 1;
                  mNotifications2 = notifyQ(searchComInd, uId, typeN2);
                  
              } 
            }

    for (var j = 0; j < res1.rowCount; j++) {
                //tVar3 = tVarM;
                mylikes = res1.rows[j].likes;
                if (j == parInd)
                {
                  tVar3 += "";
                  //j++;
                } else {
                  
                  tVar3 += "<div class='card mb-4'>";
                  tVar3 += "<div class='card-body'>";
                  tVar3 += "<h2 class='card-title'>";
                  tVar3 += res1.rows[j].username;
                  tVar3 += "</h2>";
                  tVar3 += "<p  class='card-text' id = 'p";
                  tVar3 += j.toString() + "'>";
                  tVar3 += res1.rows[j].posttext;
                  tVar3 += "</p>";
                  tVar3 += " <button formaction = '/commentS' class='btn btn-primary' name = 'bt";
                  tVar3 += j.toString() + "' ";
                  tVar3 += " id = '";
                  tVar3 += j.toString() + "'";
                  tVar3 += "> reply </button> ";
                  tVar3 += "<button formaction = '/slike' class='btn btn-primary' ";
                  tVar3 += "id = 'btn' name = 'btn";
                  tVar3 += j.toString() + "'";
                  tVar3 += "> Like </button>";
                  tVar3 += " <b>" + mylikes.toString() + " </b>"; 
                  tVar3 += " </div> </div> ";
                }
  }
 
  console.log("333 " + tVar3 );

      if (tVar3 != '') {
        qVar = "<ul class='pagination justify-content-center mb-4'>";
        qVar += "<li class='page-item'>";
        qVar += "<a class='page-link' href='#newer'>&larr; Newer</a>";
        qVar +=  "</li> <li class='page-item'> <a class='page-link' href='#Older'>Older &rarr;</a>";
        qVar += "</li> </ul>";
        } else {
          qVar = '';
        }

    res.render('index', {temp1: tVar3, page1: qVar, aName : anamev});
});

}

function postSearchComment(req, res) {

  console.log('Im here at search POST! ' + searchComInd.toString());

var querySearch = "SELECT  B.posttext, B.POSTID, A.USERNAME, A.USERID, ";
querySearch += " COUNT(POSTLIKERID) AS LIKES ";
querySearch += " FROM ACCOUNT A right JOIN POSTDETAILS B ON A.USERID = B.USERID ";
querySearch += " LEFT JOIN POSTLIKES C ON B.POSTID = C.POSTID ";
querySearch += " WHERE posttext LIKE '%";
querySearch += searchVar;
querySearch += "%'";
querySearch += " GROUP BY B.POSTID, A.USERID ";
querySearch +=  " ORDER BY B.POSTDATE DESC ";

var queryLike1 = "SELECT  B.posttext, B.POSTID, A.USERNAME, A.USERID, ";
queryLike1 += " COUNT(POSTLIKERID) AS LIKES ";
queryLike1 += " FROM ACCOUNT A RIGHT JOIN POSTDETAILS B ON A.USERID = B.USERID ";
queryLike1 += " LEFT JOIN POSTLIKES C ON B.POSTID = C.POSTID ";
queryLike1 += " WHERE B.posttext LIKE '%";
queryLike1 += searchVar + "%' AND B.POSTID = ";
queryLike1 += searchComInd.toString();
queryLike1 += " GROUP BY B.POSTID, A.USERID ";
queryLike1 += " ORDER BY B.POSTDATE DESC ";

var insertQT = "Insert INTO postComments(pcomments, postCommentDate, postCommmenterID, postID) VALUES ";
        insertQT += " ('";
        insertQT += req.body.commentsection;
        insertQT += "', ";
        insertQT += "'NOW()', ";
        insertQT += "'";
        insertQT += uId.toString() + "', ";
        insertQT += "'";
        insertQT += searchComInd.toString() + "'";
        insertQT += ")";
    
var likes1 = 0;

var qerTJ = "SELECT * "; 
      qerTJ += "FROM POSTCOMMENTS A ";
      qerTJ += " INNER JOIN ACCOUNT B ON ";
      qerTJ += " A.POSTCOMMMENTERID = B.USERID ";
      qerTJ += " WHERE A.POSTID = ";
      qerTJ += searchComInd.toString();
      qerTJ += " ORDER BY A.POSTCOMMENTDATE DESC ";

  var tVar = ' ';
//var queryCom = ;

pool.query(
  insertQT, (err1, qres1) => {
     pool.query(
      queryLike1, (err19, qres19) => { //search for everything
        pool.query(
          querySearch, (err18, qres18) => {
        pool.query(
          qerTJ, (err20, qres20) => { 
      
      likes1 = qres18.rows[0].likes;

      //console.log(qres19.rows[0].posttext);
      tVar += "";
      tVar += "<div class='card mb-4'>";
      tVar += "<div class='card-body'>";
      tVar += "<h2 class='card-title'>";
      tVar += qres19.rows[qres19.rowCount - 1].username;
      tVar += "</h2>";
      tVar += "<p  class='card-text' id = 'p";
      tVar += parInd.toString() + "'>";
      tVar += qres19.rows[qres19.rowCount - 1].posttext.toString();
      tVar += "</p>";

      tVar += "<button formaction = '/commentS' class='btn btn-primary' name = 'bt";
      tVar += qres18.rows[0].toString() + "' ";
      tVar += " id = '";
      tVar += parInd.toString() + "'";
      tVar += " > reply </button> ";
      tVar += "<button formaction = '/slike' class='btn btn-primary' ";
      tVar += "id = 'btn' name = 'btn";
      tVar += parInd.toString() + "'";
      tVar += "> Like </button> ";
      tVar += " <b>" + likes1.toString() + " </b>";
      tVar += " <br> <br> ";
     
      for (var i = 0; i < qres20.rowCount; i++) {
      tVar += "<h3>";
      tVar += qres20.rows[i].username + " </h3>";
      tVar +=" <p> ";
      tVar += qres20.rows[i].pcomments + "</p>";   //--comment section ...
      }

      tVar += "</div> </div>";  

      pool.query(
        mNotifications2, (err42, qres42) => {
        //console.log(qres42 + " ---- ");
        res.render('index', {temp1: tVar, aName: anamev});
      });
     
    });
      });
    });
  });
}



function postLike(req, res) {
  
  var queryTest1 = "SELECT * FROM ACCOUNT A INNER JOIN POSTDETAILS B ON A.USERID = B.USERID ORDER BY B.postdate DESC";
  var lInd = 0;
  var postInd = 0;

  //postInd is my postID, uId is my postLikerID ..

  var tVar = '';
  var qVar = '';

  var insertQC = '';
  var lastQ = '';  
  var cond1 = 5;    

  var queryP = "SELECT * FROM postLikes ";
  //var queryNote = "Insert INTO postNotify VALUES ()";

  pool.query(
    queryTest1, (err19, qres19) => {
      var selQ = '';
      for (var i = 0; i < qres19.rowCount; i++) {
        if (req.param('btn' + i.toString()) != undefined)
        {
          typeN = 0;
          console.log(qres19.rows[i].posttext + "  -> Is my TEXT ! ");
          lInd = qres19.rows[i].userid;
          postInd = qres19.rows[i].postid;
          console.log("Posted by user " + i + " postid " + postInd + " UID " + uId);

          selQ = "Select * From postNotify WHERE postid = ";
          selQ += postInd.toString() + " and ";
          selQ += " fanID = ";
          selQ += uId.toString();
          selQ += "";
          /*pool.query(
            selQ, (err41, qres41) => {

              console.log(qres41 + " ********** ");

          }); */
           
           //console.log(mNotifications1 + ' 8888 ');
           

          //here notifyQ(postId, fanId, typeN);
        }
      }

      pool.query(
        queryP, (err21, qres21) => {

          if (qres21.rowCount <= 0) {
            console.log("There's nothing here");
            insertQC = " INSERT INTO POSTLIKES(PLIKES, POSTLIKEDATE, POSTLIKERID, POSTID) ";
            insertQC += " VALUES ( ";
            insertQC += "'0',";
            insertQC += " 'NOW()', '";
            insertQC += uId + "', '";
            insertQC += postInd + "')";
            console.log(insertQC);
          } else {
            insertQC = "SELECT POSTLIKERID, PLIKES, POSTID, CASE ";
            insertQC += " WHEN (POSTLIKERID = ";
            insertQC += uId.toString();
            insertQC += " AND PLIKES = 0 AND POSTID = ";
            insertQC += postInd.toString();
            insertQC += ") THEN 0";
            insertQC += " ELSE 2";
            insertQC += " END AS STATLIKE ";
            insertQC += "FROM POSTLIKES;";
          }

          //I FIRSTLY NEED TO MAKE A QUERY TO GET THE ACTIVE INDEX , THEN FROM THERE ON I NEED TO USE IT
          //IN THAT IF STATEMENT.

          console.log("\n" + insertQC);
          pool.query(
            insertQC, (err31, qres31) => {
              console.log(qres31);
              
              var mInd = 0; 
              var getIndex = "SELECT * FROM POSTLIKES";

              pool.query(getIndex, (errG, qresG) => {

              for (var j = 0; j < qresG.rowCount; j++) {
                if (qresG.rows[j].plikes == 0 && qresG.rows[j].postlikerid == uId && qresG.rows[j].postid == postInd) {
                  mInd = j;
                }

              }

              console.log(" My Rows " + qres31.rows[qres31.rowCount]);

              if (qres31.command.toString() == 'SELECT')
              {

              console.log(qres31.rows[mInd].statlike + " i like Status lena ke ");
              cond1 = qres31.rows[mInd].statlike;
              }

              console.log(cond1 + " my condition");

              console.log(insertQC + "  KKK");

              if (cond1 == 2) {

                lastQ = " INSERT INTO POSTLIKES(PLIKES, POSTLIKEDATE, POSTLIKERID, POSTID) ";
                lastQ += " VALUES ( ";
                lastQ += "'0',";
                lastQ += " 'NOW()', '";
                lastQ += uId + "', '";
                lastQ += postInd.toString() + "')";

               // pool.query(
                 // selQ, (err41, qres41) => {
                  //console.log(qres41);
                 
                   mNotifications1 = notifyQ(postInd, uId, typeN);
                  pool.query(
                    mNotifications1, (err42, qres42) => {
                    console.log(qres42 + " ---- ");
                  });
              
               // }); 

              } else if (cond1 == 0) {

                /*lastQ = "UPDATE POSTLIKES ";
                lastQ += " SET POSTLIKERID = 0 , ";
                lastQ += "PLIKES = ";
                lastQ += uId.toString();
                lastQ += " WHERE POSTLIKERID = ";
                lastQ += uId.toString(); 
                lastQ += " AND POSTID = ";
                lastQ += postInd.toString(); */

                lastQ = "DELETE FROM POSTLIKES WHERE postId = ";
                lastQ += postInd.toString() + " AND postlikerID = ";
                lastQ += uId.toString() + ";"; 

                mNotifications1 = deleteQ(postInd, uId, typeN);
                pool.query(
                  mNotifications1, (err42, qres42) => {
                  console.log(qres42 + " ---- ");
                });

                //lastQ += " AND PLIKES = 0";
              } 

              console.log("\n" + lastQ);

              pool.query(
                lastQ, (err41, qres41) => {
                  console.log(" Washa khekhe!! ");
                  //Magic starts here .....

                  pool.query( // starts q
                    queryLike, (err, qres12) => {
                   // tVar = qres1.rows[0].posttext;
                    
                    if (!err) {
                     console.log(qres12.rowCount + "  111 dd");
                  for (var i = 0; i < qres12.rowCount; i++) {
                    mylikes = qres12.rows[i].likes.toString();

                    console.log(qres12.rows[i].posttext.toString() + "\n\n");

                    if (i == 0)
                    {
                    tVar +="<section class= 'newer' id='newer'>";
                    tVar += "";
                    tVar += "<div class='card mb-4'>";
                    tVar += "<div class='card-body'>";
                    tVar += "<h2 class='card-title'>";
                    tVar += qres12.rows[i].username.toString();
                    tVar += "</h2>";
                    tVar += "<p  class='card-text' id = 'p";
                    tVar += i.toString() + "'>";
                    tVar += qres12.rows[i].posttext.toString();
                    tVar += "</p>";
                    tVar += " <button formaction = '/comment' class='btn btn-primary' name = 'bt";
                    tVar += i.toString() + "'";
                    tVar += "id = '";
                    tVar += i.toString() + "'";
                    tVar += "> reply </button> ";
                    tVar += "<button formaction = '/like' class='btn btn-primary' ";
                    tVar += "id = 'btn' name = 'btn";
                    tVar += i.toString() + "'";
                    tVar += "> Like </button> ";
                    tVar += " <b> " + mylikes + " </b>";
                    tVar += "</div> </div> ";
                    tVar += "</section>";
                    } else if (i == qres12.rowCount - 1) {
                    tVar +="<section class= 'Older' id='Older'>";
                    tVar += "";
                    tVar += "<div class='card mb-4'>";
                    tVar += "<div class='card-body'>";
                    tVar += "<h2 class='card-title'>";
                    tVar += qres12.rows[i].username.toString();
                    tVar += "</h2>";
                    tVar += "<p  class='card-text' id = 'p";
                    tVar += i.toString() + "'>";
                    tVar += qres12.rows[i].posttext.toString();
                    tVar += "</p>";
                    tVar += "<button formaction = '/comment' class='btn btn-primary' name = 'bt";
                    tVar += i.toString() + "'";
                    tVar += "id = '";
                    tVar += i.toString() + "'";
                    tVar += "> reply </button> ";
                    tVar += "<button formaction = '/like' class='btn btn-primary' ";
                    tVar += "id = 'btn' name = 'btn";
                    tVar += i.toString() + "'";
                    tVar += "> Like </button>";
                    tVar += " <b> " +  mylikes + " </b> ";
                    tVar += "</div> </div> ";
                    tVar += "</section>";
                    } else {
                    tVar += "";
                    tVar += "<div class='card mb-4'>";
                    tVar += "<div class='card-body'>";
                    tVar += "<h2 class='card-title'>";
                    tVar += qres12.rows[i].username.toString();
                    tVar += "</h2>";
                    tVar += "<p  class='card-text' id = 'p";
                    tVar += i.toString() + "'>";
                    tVar += qres12.rows[i].posttext.toString();
                    tVar += "</p>";
                    tVar += "<button formaction = '/comment' class='btn btn-primary' name = 'bt";
                    tVar += i.toString() + "'";
                    tVar += "id = '";
                    tVar += i.toString() + "'";
                    tVar += " > reply </button> ";
                    tVar += "<button formaction = '/like' class='btn btn-primary' ";
                    tVar += "id = 'btn' name = 'btn";
                    tVar += i.toString() + "'";
                    tVar += "> Like </button>";
                    tVar += " <b>" + mylikes + "</b>";
                    tVar += "</div> </div> ";
                    }
                    
                  }
                }
          
                if (tVar != '') {
                  qVar = "<ul class='pagination justify-content-center mb-4'>";
                  qVar += "<li class='page-item'>";
                  qVar += "<a class='page-link' href='#newer'>&larr; Newer</a>";
                  qVar +=  "</li> <li class='page-item'> <a class='page-link' href='#Older'>Older &rarr;</a>";
                  qVar += "</li> </ul>";
                  } else {
                    qVar = '';
                  }
            
                    console.log(tVar);
                    res.render('index', {temp1: tVar, page1: qVar, aName : anamev});
                }); // end q

                  //res.render('index');

                });

              });

            });

      });
     
  });
  
}

function profilePage(req, res) {
  res.render('proff', {namSur: anamev});
}

function highlikes(req, res) {

  var comp =  [];
  var ind =  [];
  var tVar = '';
  var qVar = '';
  var mylikes2 = 0;

  var queryM = "SELECT  B.posttext, B.POSTID, A.USERNAME, A.USERID, "; 
  queryM += " COUNT(POSTLIKERID) AS LIKES "; 
  queryM += " FROM ACCOUNT A RIGHT JOIN POSTDETAILS B ON A.USERID = B.USERID ";
  queryM += " LEFT JOIN POSTLIKES C ON B.POSTID = C.POSTID ";
  queryM += " GROUP BY B.POSTID, A.USERID ";
  queryM += " Having  COUNT(POSTLIKERID) > 1 ";
  queryM += " ORDER BY B.POSTDATE DESC ";

  var queryM1 = "SELECT  B.posttext"; 
  queryM1 += " FROM ACCOUNT A RIGHT JOIN POSTDETAILS B ON A.USERID = B.USERID ";
  queryM1 += " LEFT JOIN POSTLIKES C ON B.POSTID = C.POSTID ";
  queryM1 += " GROUP BY B.POSTID, A.USERID ";
  queryM1 += " Having  COUNT(POSTLIKERID) > 1 ";
  queryM1 += " ORDER BY B.POSTDATE DESC ";

  pool.query(
    queryM1, (err1, qres1) => {  //q1
     var j = 0;
      for (var i = 0; i < qres1.rowCount; i++)
      {
        comp[i] = qres1.rows[i].posttext; 
      }
      pool.query(
        queryLike, (err12, qres12) => { 

          for (var u = 0; u < qres1.rowCount; u++)
          {
              for (var m = 0; m < qres12.rowCount; m++)
              {
            if (comp[u] == qres12.rows[m].posttext) {
                ind[j] = m;
                j++;
              } 
            }
          }

          pool.query(
            queryM, (err13, qres13) => { 
          for (var i = 0; i < qres13.rowCount; i++)
          {
              //console.log(qres13.rows[u].posttext + " < - > " + ind[u].toString());
          mylikes2 = qres13.rows[i].likes.toString();
          
         // tVar +="<section class= 'newer' id='newer'>";
          tVar += "";
          tVar += "<div class='card mb-4'>";
          tVar += "<div class='card-body'>";
          tVar += "<h2 class='card-title'>";
          tVar += qres13.rows[i].username.toString();
          tVar += "</h2>";
          tVar += "<p  class='card-text' id = 'p";
          tVar += i.toString() + "'>";
          tVar += qres13.rows[i].posttext.toString();
          tVar += "</p>";
          tVar += " <button formaction = '/comment' class='btn btn-primary' name = 'bt";
          tVar += ind[i].toString() + "'";
          tVar += "id = '";
          tVar += ind[i].toString() + "'";
          tVar += "> reply </button> ";
          tVar += "<button formaction = '/like' class='btn btn-primary' ";
          tVar += "id = 'btn' name = 'btn";
          tVar += ind[i].toString() + "'";
          tVar += "> Like </button> ";
          tVar += " <b> " + mylikes2 + " </b>";
          tVar += "</div> </div> ";
          tVar += "</section>";
              
          }

          if (tVar != '') {
            qVar = "<ul class='pagination justify-content-center mb-4'>";
            qVar += "<li class='page-item'>";
            qVar += "<a class='page-link' href='#newer'>&larr; Newer</a>";
            qVar +=  "</li> <li class='page-item'> <a class='page-link' href='#Older'>Older &rarr;</a>";
            qVar += "</li> </ul>";
            } else {
              qVar = '';
            }
      
              console.log(tVar);
              res.render('index', {temp1: tVar, page1: qVar, aName : anamev});

          });

        });

      //res.render('index');
    });

}

function notificationPage(req, res) {
  //mNotify: "I Liked".

  

  res.render('notifications', {aName : anamev});
}

const pg = require('pg');

const pool = new pg.Pool({

  user: 'sli',
  host:'127.0.0.1',
  database:'testDB4',
  password:'@Sli2354',
  port:'5432'

});


/*************************** ROUTES ****************************************/
function life1() {
  callB();
}

function callB() {
  setTimeout(function() {life1()} ,
   500);
  console.log('TimeOut 1');
}

app.get('/', function(req, res) {
  startPage(req, res);
 // life1();
});

app.get('/create', function(req, res) {
  createAccount(req, res);
});

app.get('/login', function(req, res) {
  loginAccount(req, res);
});

app.post('/comment', function(req, res) {
  commentPage(req, res); 
});

app.get('/post', function(req, res) {
  postPage(req, res);
});

app.get('create', function(req, res) {
  createAccount(req, res);
});

app.get('/profile', function(req, res) {
  profilePage(req, res);
});

app.get('/mostlikes', function(req, res) {
  highlikes(req, res);
});

app.post('/confirm', function(req, res) {
  confirmAccount(req, res);
});

app.post('/home1', function(req, res) {
  homePage(req, res);
  //callB();
});

app.get('/home', function(req, res) {
  homePage2(req, res);
});

app.get('/notifications', function(req, res) {
  notificationPage(req, res);
});

app.post('/postP', function(req, res) {
  postPosted(req, res);
});

app.post('/postcomment', function(req, res) {
  postComment(req, res);
});

app.post('/search', function(req, res) {
  searchPage(req, res);
});

app.post('/like', function(req, res) {
  postLike(req, res);
});

app.post('/slike', function(req, res) {
  searchLiker(req, res);
});

app.post('/commentS', function(req, res) {
  searchCommenter(req, res);
});

app.post('/postcommentS', function(req, res) {
  postSearchComment(req, res);
});
/********************** LISTEN TO MY PORT ********************************/
app.set('port', process.env.PORT||4000);

app.listen(app.get('port'), function() {
  console.log('Express started on http:// local host:' + 
  app.get('port') + 'press C-trl C to terminate!');
  pool.connect();
}); 
