app.controller("HomeCtrl", ['$scope', '$http', 'Endpoint', function ($scope, $http, Endpoint) {
    $scope.agents = Endpoint("agent", true).get({mRound:80});
    $scope.dataOptions = {};
    $scope.data = [
    ]
    $scope.barItems = [];
  $scope.links = [
    {
      "source" : 0,
      "target" : 2
    },
    {
      "source" : 1,
      "target" : 2
    },
    {
      "source" : 2,
      "target" : 0
    }
  ]
    $scope.$on("propertyselected",function(e,d){
      for(var i in d.children){
        if(d.children[i].name == "[mValue]"){
          $scope.setSelectedProperty(d.name.replace("[","").replace("]",""));
        }
      }
    })
    function recurseFind(object,property){
        var solution;
        for(var i in object){

          if(i==property){
            solution =  object[i];
          }else{
            if(_.isObject(object[i]) || _.isArray(object[i]) ){
                var temp = recurseFind(object[i],property)
                 if(temp){
                   solution = temp;
                 }
            }
          }
        }
      return solution;
    }
    $scope.setSelectedProperty = function(property){
        var value = [];
        for(var i in $scope.agents){
          var temp = recurseFind($scope.agents[i],property);
          //console.log(temp);
          if(temp){
            value.push(temp);
          }
        }


          $scope.$apply(function(){
            for(var i in value){
              $scope.barItems.push({
                value : value[i].mValue.mCurrentValue
              });
            }
          })


        //console.log("BarItems",$scope.barItems);
    }

    $scope.$watch("agents",function(newvalue){

      if(_.keys(newvalue).length > 0){
          $scope.data = [];
          for(var i in newvalue){
            var temp = newvalue[i];
            if(!temp.mParentAgent){
              $scope.data.push(temp);
            }

          }
          for(var i in $scope.data){
            if($scope.data[i].mNetwork){
              //console.log("Go in recurse",$scope.data[i].mNetwork);
              $scope.recurseNetwork($scope.data[i],newvalue);
            }
          }
      }
    },true)
    $scope.recurseNetwork = function(object,array){

      for(var o in object.mNetwork.mAgents){
       // console.log(object.mNetwork);
        object.mNetwork.mAgents[o] = $scope.find(array,"_id",object.mNetwork.mAgents[o].$id);
        if(object.mNetwork.mAgents[o].mNetwork){
          $scope.recurseNetwork(object.mNetwork.mAgents[o],array);
        }
      }
    }
    $scope.find = function(array,selector,value){
      for(var a in array){
        if(array[a][selector] == value){
          return array[a];
        }
      }
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