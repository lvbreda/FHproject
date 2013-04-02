/*
 connection
 {
 type: mongodb/mysql,
 reactive: true/false,
 details : {}/""
 }
 */
var _connection;
var _callback = function (name, result) {
    _communicator.fireListeners(name, result);
};
var db;
var _communicator = require("../rCom/main.js");
exports.init = function (connection) {
    _connection = connection;
}
exports.connection = _connection;
exports.communicator = _communicator;

exports.createDB = function (connection) {
    _connection = connection ? connection : _connection;
    var self = this;
    db = require('./lib/' + _connection.type);
    db.setup(_connection.details);

    if (_connection.reactive) {
        db.setReactive(_connection.reactive, _callback);
    }
    return db;
}

