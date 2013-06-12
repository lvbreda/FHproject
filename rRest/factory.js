var express = require('express');
var cookie = require('cookie');
var connect = require('connect');
var pubQueries = require('../rMiddleware/pubQuery.js')
var app = express();
var restFactory = require("./lib/rest.js");
var socketFactory = require("./lib/socket.js");
var restServers = [];
var socketServers = [];
var sessionStore = new connect.session.MemoryStore();
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    app.use(express.session({ secret:'thisissomerandomsecret', key:'express.sid', store: sessionStore }));
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.csrf());
    app.use(express.static('./public'));
});
var server = app.listen(3000);
var io = require('socket.io').listen(server);
exports.factory = function (db, collection, realtime, options) {
    var socketserver;
    options = options || {};
    options.queries = pubQueries;
    if (realtime) {
        socketserver = socketFactory.factory(app, io, db, collection, options);
        socketServers.push(socketFactory.factory(app, io, db, collection, options));
        options.socketserver = socketserver;
    }

    var restserver = restFactory.factory(app, db, collection, options,pubQueries);
    restServers.push(restserver);
}
exports.app = app;

