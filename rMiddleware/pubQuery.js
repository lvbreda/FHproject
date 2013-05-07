
/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 03/05/13
 * Time: 11:00
 * To change this template use File | Settings | File Templates.
 */
/*
  SOCKET && EXPRESS shared session SCALABLE???
  Pickup on insert && update,
    Middleware, register query, activate query on socket.emit

  Reflect against queries
    Use synchronous && blocking _.where from underscore OR async concurrency?

  Update sometimes not allowed query (so remove after update on clients side) HANDLE ?
    Implement kill signal ? / form update query to a remove query.
    needed _id && type

  INSERT block if not match , What to do with updates wich make a new document comply to query.
    ??

   PUB(rest,socket)
                  <- Initial data
                  <- Socket connection (handshake)
                                <- Database update
                     Pickup change (oplog,...)
                  <- Form/Send to unified format
   Interpret format
   Act on local in memory db (max 1 gig) modern browsers. Local query mechanism.
   Update Data
             REQUEST
                  ->MiddleWare(save request)
                            ->Successfull insert/update
                                  ->Middleware Notify sockets
                  <- IDEM as above

*/
var _ = require('underscore');
var q = require('q');
var mongo = require('mongoskin');
var queries = [

]
var db = mongo.db("127.0.0.1" + "/" + "yarr_queries", {w:1});


var checkAgainst = function(queries,content){

    if(content.action == "insert"){
      for(var i in queries){


        if(_.findWhere([content.query],queries[i][0])){
           return true;
        }
      }
      return false;
    }
    return true;
}
exports.isInQuery = function(sessionid,content){
  var deferred = q.defer();
  var query = _.findWhere(queries, {sessionID: sessionid});
  if(!query){
      db.collection("queries").find({},{},function(err,result){
          if(result){
            deferred.resolve(checkAgainst(result.content,content));
          }
      });
  }else{
    deferred.resolve(checkAgainst(query,content));
  }
  return deferred.promise;
}

exports.addToQuery = function(sessionid,query){
  var queryB = _.findWhere(queries, {sessionID: sessionid});
  if(!queryB){
    queryB = {
      "sessionID" : sessionid,
      "content" : []
    }
    queries.push(queryB);
  }
  queryB.content.push(query);
}