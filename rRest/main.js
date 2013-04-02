var express = require('express');
var app = express();
var restFactory = require("lib/rest.js");
var socketFactory = require("lib/socket.js");
var restServers = [];
var socketServers = [];
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    app.use(express.session({ secret:'thisissomerandomsecret' }));
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.csrf());
    app.use(express.static(__dirname + '/public'));
});
var server = app.listen(3000);
var io = require('socket.io').listen(server);
exports.factory = function (db, collection, realtime, options) {
    restServers.push(restFactory.factory(express, db, collection, options));
    if (realtime) {
        socketServers.push(socketFactory.factory(express, io, db, collection, options));
    }
}
exports.app = app;

