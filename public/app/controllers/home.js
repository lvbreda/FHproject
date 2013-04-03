app.controller("HomeCtrl", ['$scope', '$http', 'Endpoint', function ($scope, $http, Endpoint) {
    $scope.hi = Endpoint("Users", true).get({"name":"lander"});
    $scope.users = Endpoint("Users", true).get({});
}]);