var express = require('express');
var cookie = require('cookie');
var connect = require('connect');
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
io.set('authorization', function (data, accept) {
    // check if there's a cookie header

    if (data.headers.cookie) {
        // if there is, parse the cookie
        data.cookie = cookie.parse(data.headers.cookie);
        // note that you will need to use the same key to grad the
        // session id, as you specified in the Express setup.
        data.sessionID = data.cookie['express.sid'];
        sessionStore.get(data.sessionID, function(err, session){
            if (err) {
                return accept('Error in session store.', false);
            } else if (!session) {
                return accept('Session not found.', false);
            }
            // success! we're authenticated with a known session.
            data.session = session;
            return accept(null, true);
        });
    } else {
        // if there isn't, turn down the connection with a message
        // and leave the function.
        return accept('No cookie transmitted.', false);
    }
    // accept the incoming connection
    accept(null, true);
});
exports.factory = function (db, collection, realtime, options) {
    var socketserver;
    options = options || {};
    if (realtime) {
        socketserver = socketFactory.factory(app, io, db, collection, options);
        socketServers.push(socketFactory.factory(app, io, db, collection, options));
        options.socketserver = socketserver;
    }

    var restserver = restFactory.factory(app, db, collection, options);
    restServers.push(restserver);
}
exports.app = app;

