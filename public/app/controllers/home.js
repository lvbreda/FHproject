app.controller("HomeCtrl", ['$scope', '$http', 'Endpoint', function ($scope, $http, Endpoint) {
    $scope.dancers = Endpoint("Dancers", true).get({});
    $scope.users = Endpoint("Users", true).get({});
    $scope.selectedUser;


    $scope.chartdata = [
                {
                    "label": "One",
                    "value" : 29.765957771107
                } ,
                {
                    "label": "Two",
                    "value" : 0
                } ,
                {
                    "label": "Three",
                    "value" : 32.807804682612
                } ,
                {
                    "label": "Four",
                    "value" : 196.45946739256
                } ,
                {
                    "label": "Five",
                    "value" : 0.19434030906893
                } ,
                {
                    "label": "Six",
                    "value" : 98.079782601442
                } ,
                {
                    "label": "Seven",
                    "value" : 13.925743130903
                } ,
                {
                    "label": "Eight",
                    "value" : 5.1387322875705
                }
            ];
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