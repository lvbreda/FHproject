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
            _db.communicator.registerListener(_collection, function (name, obj) {
                console.log(hsData.address);
                socket.emit(name, _collection, obj);
            });
            //console.log(_db.communicator);
        });
    self.addQuery = function (query) {
        self.queries.push(query);
    }

}