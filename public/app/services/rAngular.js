/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 02/04/13
 * Time: 13:40
 * To change this template use File | Settings | File Templates.
 */
angular.module('rAngular', []).factory("Endpoint", ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
    var EndpointFactory = function (collection, realtime) {


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
            value = this instanceof EndPoint ? this : [];
            var url = "api/" + collection;
            var querystring = "?";
            if (query) {
                querystring += EndPoint.objectToQs(query);
            }
            url = query ? url + querystring : url;
            $http.get(url).success(function (result) {
                    angular.forEach(result, function (item) {
                        value.push(item);
                    });
                    setTimeout(function () {
                        $rootScope.$apply(function () {
                            value.push("hi");
                            console.log(value);
                        });
                    }, 2000);
                }
            );
            return value;
        }
        return EndPoint;
    }
    return EndpointFactory
}]);