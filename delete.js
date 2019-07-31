function notify(postId, fanId, typeN) {

    var insertQuery = "";

    insertQuery = "DELETE FROM postNotify WHERE fanID = ";
    insertQuery += fanId.toString() + " and ";
    insertQuery += " postID = ";
    insertQuery += postId.toString();
 

    console.log(insertQuery);

    return insertQuery;
}

module.exports = notify;