/*



 */

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
            console.log("Query incoming",query);
            var deferred = q.defer();
            if (query._id) query._id = new BSON.ObjectID(query._id);
            console.log("Find", self.name);
            db.collection(self.name).find(query,{}).toArray(function (err, result) {
                console.log("Result",result.length);
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
    db = mongo.db(connection.uri + "/" + connection.dbname, {w:1});
}
exports.setReactive = function (reactive, connection) {
    if (reactive) {
        var oplogdb = mongo.db(connection.uri + "/local", {w:1});
        oplog = oplogdb.collection("oplog.$main");
        var cursor = oplog.find({}, {tailable:true, awaitData:true});
        cursor.each(function (err, log) {
            if (err) console.log("Reactive Error", err);
            if (!err){
                switch(log.op){
                    case "i":
                        _communicator.fireListeners(log.ns.split(".")[1], {
                            "action":"insert",
                            "query":log.o,
                            "options":log.o
                        });
                        break;
                    case "u":
                        _communicator.fireListeners(log.ns.split(".")[1], {
                            "action":"update",
                            "query":log.o2,
                            "options":log.o
                        });
                        break;
                    case "d":
                        _communicator.fireListeners(log.ns.split(".")[1], {
                            "action":"remove",
                            "query":log.o,
                            "options":log.o
                        });
                        break;
                }
            }
        });
    }
}
exports.createCollection = function (name) {
    return new CollectionFactory(name);
}