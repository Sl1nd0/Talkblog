function notify(postId, fanId, typeN) {

    var insertQuery = "";
    insertQuery = "Insert INTO postNotify (fanID, typeNotication, postID) VALUES (";
    insertQuery += fanId.toString() + ", ";
    insertQuery += typeN.toString() + ", ";
    insertQuery += postId.toString() + ")";

    console.log(insertQuery);

    return insertQuery;
}

module.exports = notify;