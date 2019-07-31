function mynotification1(userID) {

var mquery = " Select Count(B.userID) as totalNot ";
mquery += " From postNotify A ";
mquery += " Inner join postDetails B on A.postID = B.postID ";
mquery += " WHERE B.userID = ";
mquery += userID.toString();

return mquery;
}

module.exports = mynotification1;