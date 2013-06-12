var utils = require("./utils.js");
var _ = require("underscore");

/**
 * Factory for the sockets
 */
exports.factory = function (express, sockets, db, collection, options) {
    var _collection = collection;
    var _db = db.createCollection(_collection);
    var self = this;
    var pubQueries = options.queries
    if (options.unique) {
        _collection = options.unique;
    }
    /*
      Open room for certain collection.
     */
    sockets.of('/' + _collection)
        .on('connection', function (socket) {
            var hsData = socket.handshake;
        /**
         * Restful clone for use of ws , faster transfer , lack of decent status codes etc (can be implemented)
         */
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
        /** Most important part , registering listener on certain collection with applicable callback. Queries are binded
         * with sessionIDS which are in the handshake of our socket (saved in scope above). If pas, emit on this socket.**/
            _db.communicator.registerListener(_collection, function (name, obj) {
                pubQueries.isInQuery(hsData.sessionID,obj).then(function(res){
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
