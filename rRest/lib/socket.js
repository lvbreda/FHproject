var utils = require("./utils.js");
var _ = require("underscore");
exports.factory = function (express, sockets, db, collection, options) {
    var _collection = collection;
    var _db = db.createCollection(_collection);
    var self = this;
    var pubQueries = options.queries
    if (options.unique) {
        _collection = options.unique;
    }
    sockets.of('/' + _collection)
        .on('connection', function (socket) {
            var hsData = socket.handshake;

            socket.on('get', function (id, query) {
                _db.find(query, options.fields).then(function (result) {
                    socket.emit(id, result);
                });
            });
            socket.on('getOne', function (id, query) {
                _db.findOne(query, options.fields).then(function (result) {
                    socket.emit(id, result);
                });
            });
            socket.on('update', function (id, query, values) {
                _db.update(query, {$set:utils.cleanObject(values)}).then(function (result) {
                    socket.emit(id, result);
                });
            });
            socket.on('remove', function (id, query) {
                _db.remove(query).then(function (result) {
                    socket.emit(id, result);
                });
            });
            socket.on('insert', function (id, query) {
                _db.insert(query).then(function (result) {
                    socket.emit(id, result);
                });
            });
        //console.log(hsData.sessionID);
            _db.communicator.registerListener(_collection, function (name, obj) {
                pubQueries.isInQuery(hsData.sessionID,obj).then(function(res){
                  //  console.log(res);
                    if(res == true){
                      socket.emit(name, _collection, obj);
                    }
                });

            });
        });
    self.addQuery = function (query) {
        self.queries.push(query);
    }
}
