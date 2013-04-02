app.controller("HomeCtrl", ['$scope', '$http', 'Endpoint', function ($scope, $http, Endpoint) {
    $scope.hi = Endpoint("Users", false).get({"name":"lander"});

}]);