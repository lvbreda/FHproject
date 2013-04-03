/**Mongo db connection setup**/
var mongo = require('mongoskin');
var BSON = mongo.BSONPure;
var q = require('q');
var db;
var oplog;
var _communicator = require("../../rCom/main.js");

/**Collection **/

var CollectionFactory = function (name) {

    var communicator = _communicator;

    function Collection(name, communicator) {
        var self = this;
        self.name = name;
        self.communicator = communicator;
        self.find = function (query, options) {
            var deferred = q.defer();
            if (query._id) query._id = new BSON.ObjectID(query._id);
            console.log("Find", self.name);
            db.collection(self.name).find(query, options).toArray(function (err, result) {
                if (err) console.log("Error", err);
                deferred.resolve(result);
            });
            return deferred.promise;
        }
        self.findOne = function (query, options) {
            var deferred = q.defer();
            if (query._id) query._id = new BSON.ObjectID(query._id);
            db.collection(self.name).findOne(query, options, function (err, result) {
                if (err) console.log("Error", err);
                deferred.resolve(result);
            });
            return deferred.promise;
        }
        self.remove = function (query, options) {
            var deferred = q.defer();
            if (query._id) query._id = new BSON.ObjectID(new String(query._id));
            db.collection(self.name).remove(query, options, function (err, result) {
                if (err) console.log("Error", err);
                self.communicator.fireListeners(self.name, {
                    "action":"remove",
                    "query":query,
                    "options":options
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        }
        self.update = function (query, options) {
            var deferred = q.defer();
            query._id = new BSON.ObjectID(new String(query._id));
            db.collection(self.name).update(query, options, function (err, result) {
                if (err) console.log("Error", err);
                deferred.resolve(result);
                self.communicator.fireListeners(self.name, {
                    "action":"update",
                    "query":query,
                    "options":options
                });
            });
            return deferred.promise;
        }
        self.insert = function (query, options) {
            var deferred = q.defer();
            db.collection(self.name).insert(query, options, function (err, result) {
                if (err) console.log("Error", err);
                deferred.resolve(result);
                self.communicator.fireListeners(self.name, {
                    "action":"insert",
                    "query":query,
                    "options":options
                });
            });
            return deferred.promise;
        }

    }

    return new Collection(name, communicator);

}
exports.setup = function (connection) {
    db = mongo.db(connection.uri, {w:1});
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
exports.createCollection = function (name) {
    return new CollectionFactory(name);
}