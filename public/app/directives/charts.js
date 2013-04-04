/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 04/04/13
 * Time: 11:55
 * To change this template use File | Settings | File Templates.
 */
angular.module('d3Charts', []).directive('d3pie',function(){
    /**mmm pie**/
 return{
     restrict : 'A',
     scope:{
         data: "=data",
         attribute: "=attribute",
         label : "=label"
     },
     link : function(scope,element,attrs){

          self.label = scope.label;
          self.attribute = scope.attribute;
          self.data = [];

         scope.$watch("data",function(){
             nv.addGraph(function() {
                 var width = 500,
                     height = 500;

                 var chart = nv.models.pieChart()
                     .x(function(d) { return d[self.label] })
                     .y(function(d) { return d[self.attribute] })
                     //.showLabels(false)
                     .values(function(d) { return d })
                     .color(d3.scale.category10().range())
                     .width(width)
                     .height(height);

                 d3.select(attrs.id)
                     .datum([scope.data])
                     .transition().duration(1200)
                     .attr('width', width)
                     .attr('height', height)
                     .call(chart);

                 chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

                 return chart;
             });
         });
     }
 }
})