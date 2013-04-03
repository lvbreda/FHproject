/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 02/04/13
 * Time: 13:40
 * To change this template use File | Settings | File Templates.
 */
angular.module('rAngular', []).service("$rSocket", [function ($rootScope) {
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
    return self;
}]).factory("Endpoint", ['$http', '$q', '$rootScope', '$rSocket', function ($http, $q, $rootScope, $rSocket) {
    var EndpointFactory = function (collection, realtime) {
        var value;
        var globalquery;
        if (realtime) {
            $rSocket.registerSocket(collection, function (col, data) {
                $rootScope.$apply(function () {
                    switch (data.action) {
                        case "insert":
                            if (globalquery && (_.findWhere([data.query], globalquery) || _.keys(globalquery).length == "0")) {
                                value[data.query._id] = data.query;
                            }
                            break;
                        case "update":
                            for (var i in data.options.$set) {
                                value[data.query._id][i] = data.options.$set[i];
                            }
                            break;
                        case "remove":
                            delete value[data.query._id];
                            break;
                    }
                    console.log(globalquery);
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
                        value[item._id] = item;
                    });
                }
            );
            return value;
        }

        return EndPoint;
    }
    return EndpointFactory
}]);