function mynotification(userID) {
//---For my like notifications

var mquery = "SELECT  B.posttext, B.POSTID, C.USERNAME, C.USERID, A.fanid, ";
mquery +=   " COUNT (D.POSTLIKERID) AS LIKES ";
mquery += " From postNotify A ";
mquery += " Inner join postDetails B on A.postID = B.postID ";
mquery += " inner join Account C on B.userID = C.userId ";
mquery += " LEFT JOIN POSTLIKES D ON B.POSTID = D.POSTID ";
mquery += " WHERE B.POSTID = ";
mquery += userID.toString();
mquery += " GROUP BY B.POSTID, C.USERID, A.fanid ";
mquery += " ORDER BY B.POSTDATE DESC ";
mquery += " Limit 10 ";

return mquery;
}

module.exports = mynotification;