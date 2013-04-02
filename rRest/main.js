var express = require('express');
var app = express();

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


exports.factory = function (collection, realtime, fields) {

}
exports.app = app;