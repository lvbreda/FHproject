/*
 connection
 {
 type: mongodb/mysql,
 reactive: true/false,
 details : {}/""
 }
 */
var _connection;
var _callback;
var _communicator = require("../rCom/main.js");
exports.init = function (connection, callback) {
    _connection = connection;
    _callback = callback;

}
exports.connection = _connection;
exports.communicator = _communicator;
exports.createDB = function (connection, callback) {
    _connection = connection ? connection : _connection;
    _callback = callback ? callback : _callback;

    var self = this;
    var db = require('lib/' + _connection.type);
    db.setup(_connection.details);

    if (_connection.reactive) {
        db.setReactive(_connection.reactive, _callback);
    }
    return db;
}
