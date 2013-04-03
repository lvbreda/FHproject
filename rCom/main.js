/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 01/04/13
 * Time: 17:42
 * To change this template use File | Settings | File Templates.
 */
var async = require('async');
var listeners = [];

exports.registerListener = function (name, callback) {
    if (!listeners[name]) {
        listeners[name] = [];
    }

    listeners[name].push(callback);

}
exports.fireListeners = function (name, data) {
    console.log(listeners);
    async.each(listeners[name], function (_listener, callback) {
        _listener(name, data);
    }, function (err) {
        console.log("Listener error", err);
    });
}