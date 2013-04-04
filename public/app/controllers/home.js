app.controller("HomeCtrl", ['$scope', '$http', 'Endpoint', function ($scope, $http, Endpoint) {
    $scope.dancers = Endpoint("Dancers", true).get({});
    $scope.users = Endpoint("Users", true).get({});
    $scope.selectedUser;
    $scope.items = Endpoint("Items", true).get({});
    $scope.setSelectedUser = function (user) {
        $scope.selectedUser = user;
    }
    $scope.addNewUser = function (newuser) {
        Endpoint("Users", false).insert(newuser);
    }
    $scope.getLength = function(users){
        return _.keys(users).length;
    }
}]);