var utils = require("./utils.js");
var _ = require("underscore");
exports.factory = function (express, sockets, db, collection, options) {
    var _collection = collection;
    var _db = db.createCollection(_collection);
    var self = this;
    self.queries = [];
    if (options.unique) {
        _collection = options.unique;
    }
    sockets.of('/' + _collection)
        .on('connection', function (socket) {
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
            socket.on('update', function (id, _uniqueId, values) {
                _db.update({_id:_uniqueId}, {$set:utils.cleanObject(values)}).then(function (result) {
                    socket.emit(id, result);
                });
            });
            socket.on('delete', function (id, _uniqueId) {
                _db.remove({_id:_uniqueId}).then(function (result) {
                    socket.emit(id, result);
                });
            });

            _db.communicator.registerListener(_collection, function (name, obj) {
                socket.emit(name, _collection, obj);
            });
            console.log(_db.communicator);
        });
    self.addQuery = function (query) {
        self.queries.push(query);
    }

}