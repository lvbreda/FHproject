/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 01/04/13
 * Time: 21:03
 * To change this template use File | Settings | File Templates.
 */
/*
  Middleware:
  PreHooks  : On requests
  PostHooks : On responses

  Async is used to send these sometimes long during middleware tasks in the event loop with still sync up after to
  respond only after all tasks have been ran.
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