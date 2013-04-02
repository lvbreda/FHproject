/**Mongo db connection setup**/
var mongo = require('mongoskin');
var q = require('q');
var db;
var oplog;


/**Collection **/

var Collection = function (name) {
    var self = this;
    self.find = function (query, options) {
        var deferred = q.defer();
        db.collection(name).find(query, options).toArray(function (err, result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    self.findOne = function (query, options) {
        var deferred = q.defer();
        db.collection(name).findOne(query, options, function (err, result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    self.remove = function (query, options) {
        var deferred = q.defer();
        db.collection(name).remove(query, options, function (err, result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    self.update = function (query, options) {
        var deferred = q.defer();
        db.collection(name).update(query, options, function (err, result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    self.insert = function (query, options) {
        var deferred = q.defer();
        db.collection(name).insert(query, options, function (err, result) {
            deferred.resolve(result);
        });
        return deferred.promise;
    }
}
exports.setup = function (connection) {
    db = mongo.db(connection.uri);
}
exports.setReactive = function (reactive, callback) {
    if (reactive) {
        oplog = db.collection("oplog.$main");
        var cursor = oplog.find({"ns":{$not:""}}, {tailable:true, awaitData:true});
        cursor.each(function (err, log) {
            if (err) console.log("Reactive Error", err);
            if (!err) console.log("Oplog", log);
        });
    }
}
exports.find = function (query, options) {

}