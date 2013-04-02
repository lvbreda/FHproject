var utils = require("./utils.js");
exports.factory = function (express, sockets, db, collection, options) {
    var _collection = collection;
    var _db = db.createDB();
    if (options.unique) {
        _collection = options.unique;
    }
    io.of('/' + _collection)
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
                _db.update({_id:_uniqueId}, {$set:u.cleanObject(values)}).then(function (result) {
                    socket.emit(id, result);
                });
            });
            socket.on('delete', function (id, _uniqueId) {
                _db.remove({_id:_uniqueId}).then(function (result) {
                    socket.emit(id, result);
                });
            });
            _db.communicator.registerListener(_collection, function (name, result) {
                socket.emit(name, _collection, result);
            });
        });
}