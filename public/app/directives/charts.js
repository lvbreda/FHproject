angular.module('AwesomeChartJS', []).directive('awesomechart', function () {
        return {
            restrict:'A',
            link:function (scope, element, attrs) {
                scope.color = {};
                scope.first  = true;
                //TODO: it is not cool that AwesomeChart can work with ids only :-( consider sending a pull request for this / or just fork since it is also messing with Array''s prototype
                //TODO: other pb with the lib is that is messing up with the Array.prototype and is in global scope
                scope.colors = {
                    "red" : "#E74C3C",
                    "yellow" : "#F1C40F",
                    "blue" : "#3498DB"
                }
                scope.options = {
                    "animation" : false
                }
                var redraw = function (newScopeData) {

                    var doughnutData = [];
                    for(var i in newScopeData){
                       console.log(scope.colors[newScopeData[i].color]);
                        if(newScopeData[i].color.indexOf("#") == -1){
                            newScopeData[i].color = scope.colors[newScopeData[i].color];
                        }

                        doughnutData.push(newScopeData[i]);
                    }
                    var temp = {

                    };
                    if(attrs.type=="Bar"){
                        temp.labels = [];
                        temp.datasets = [];
                        temp.datasets[0] = {};
                        temp.datasets[0].fillColor = doughnutData[0].color;
                        temp.datasets[0].strokeColor = "#ffffff";
                        temp.datasets[0].data = [];
                        for(var i in doughnutData){
                            temp.labels.push(doughnutData[i].label);
                            temp.datasets[0].data.push(doughnutData[i].value);
                        }
                        doughnutData = temp;
                    }
                    var myDoughnut = new Chart(document.getElementById(attrs.id).getContext("2d"))[attrs.type](doughnutData,scope.options);
                };

                scope.$watch(attrs.data, redraw, true);
            }
        }
    }
);