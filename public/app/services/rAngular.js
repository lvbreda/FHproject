/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 02/04/13
 * Time: 13:40
 * To change this template use File | Settings | File Templates.
 */
angular.module('rAngular', []).factory("Endpoint", ['$q', function ($q) {
    var Endpoint = function (collection) {
        var self = this;
        self.collection = collection;

        if (realtime) {
            self.socket = io.connect('localhost:3000/' + collection);
        }
        self.get = function (query) {

        }
        return self;
    }
    return Endpoint
}]);