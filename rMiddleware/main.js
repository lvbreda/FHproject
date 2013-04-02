/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 01/04/13
 * Time: 21:03
 * To change this template use File | Settings | File Templates.
 */
var async = require("async");
var preHooks = [];
var postHooks = [];
exports.registerPreHook = function (_call) {
    preHooks.push(_call);
}
exports.registerPostHook = function (_call) {
    postHooks.push(_call);
}
exports.executePreHooks = function (req, res, next) {
    preHooks.forEach(function (_call) {
        _call(req, res);
    });
    next();
}
exports.executePostHooks = function (req, res, next) {
    postHooks.forEach(function (_call) {
        _call(req, res);
    });
    next();
}