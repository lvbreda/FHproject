/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 02/04/13
 * Time: 13:39
 * To change this template use File | Settings | File Templates.
 */
var app = angular.module('rLive', ['rAngular','AwesomeChartJS']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', {controller:"HomeCtrl", templateUrl:'views/home.html'}).
            otherwise({redirectTo:'/'});
    });
