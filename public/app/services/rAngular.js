/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 02/04/13
 * Time: 13:40
 * To change this template use File | Settings | File Templates.
 */
angular.module('rAngular', []).service("$rSocketId", [function () {
    var self = this;
    self.generateToken = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}]).service("$rSocket", ['$rootScope', function ($rootScope) {
    var self = this;
    self.callbackPool = {};
    self.socketsPool = {};
    self.registerSocket = function (collection, callback) {
        self.callbackPool[collection] = self.callbackPool[collection] || [];
        self.callbackPool[collection].push(callback);
        if (!self.socketsPool[collection]) {
            var socket = io.connect('http://localhost:3000/' + collection);
            socket.on(collection, function (col, data) {
                _.each(self.callbackPool[collection], function (_callback) {
                    _callback(col, data);
                });
            });
            self.socketsPool[collection] = socket;
        }
    }
    self.get = function (collection) {
        return self.socketsPool[collection];
    }
    return self;
}]).factory("$rObject", ["$rSocket",
    function ($rSocket) {
        function ObjectFactory(collection, objectvalue) {
            if (!objectvalue) {
                return;
            }
            objectvalue.$save = function () {
                $rSocket.get(collection).emit("update", Math.random(), {_id:objectvalue._id}, objectvalue);
            }
            objectvalue.$remove = function () {

                $rSocket.get(collection).emit("remove", Math.random(), {_id:objectvalue._id});
            }
            return objectvalue;
        }

        return ObjectFactory;
    }]).factory("Endpoint", ['$http', '$q', '$rootScope', '$rSocket', '$rObject', function ($http, $q, $rootScope, $rSocket, $rObject) {
    var EndpointFactory = function (collection, realtime,index) {
        index = index || "_id";
        var value;
        var globalquery;
        if (realtime) {
            $rSocket.registerSocket(collection, function (col, data) {
                $rootScope.$apply(function () {
                    switch (data.action) {
                        case "insert":
                            if (globalquery && (_.findWhere([data.query], globalquery) || _.keys(globalquery).length == "0")) {
                                value[data.query[index]] = new $rObject(collection, data.query);
                            }
                            break;
                        case "update":
                            if (value[data.query[index]]) {
                                for (var i in data.options.$set) {
                                    value[data.query[index]][i] = data.options.$set[i];
                                }
                                if (!(_.findWhere([value[data.query[index]]], globalquery) || _.keys(globalquery).length == "0")) {
                                    delete value[data.query[index]];
                                }
                            }
                            break;
                        case "remove":
                            delete value[data.query[index]];
                            break;
                    }
                });
            });
        }
        function EndPoint(value) {
            angular.copy(value || {}, this);
        }

        EndPoint.objectToQs = function (obj) {
            var str = [];
            for (var k in obj) {
                str.push(k + "=" + obj[k]);
            }
            return str.join("&");
        }
        EndPoint.get = function (query) {
            value = this instanceof EndPoint ? this : {};
            var url = "api/" + collection;
            var querystring = "?";
            if (query) {
                querystring += EndPoint.objectToQs(query);
                globalquery = query;
            }
            url = query ? url + querystring : url;
            $http.get(url).success(function (result) {
                    angular.forEach(result, function (item) {
                        value[item[index]] = new $rObject(collection, item);
                    });
                }
            );
            return value;
        }
        EndPoint.insert = function (query) {
            $rSocket.get(collection).emit("insert", Math.random(), query);
        }
        return EndPoint;
    }
    return EndpointFactory
}]);