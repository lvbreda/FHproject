app.controller("HomeCtrl", ['$scope', '$http', function ($scope, $http) {
    $scope.hi = [];
    $http.get("api/Users").success(function (result, code) {
        $scope.hi = result;
    })
}]);