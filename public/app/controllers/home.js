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

    $scope.mapOptions = {
        "onclick" : "maptooltip",

    }







    /**Tooltip**/
    $scope.popupleft = 0;
    $scope.popuptop = 0;
    $scope.popupshow= false;
    $scope.popupdescription = "";
    $scope.maptooltip  = function(d,i,event){
        $scope.$apply(function(){
            $scope.popupshow = true;
            $scope.popupleft = event.pageX-105;
            $scope.popuptop = event.pageY-160;
            $scope.popupdescription = d.description;
        })

    }
}]);