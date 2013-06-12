/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 02/04/13
 * Time: 13:39
 * To change this template use File | Settings | File Templates.
 */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var app = angular.module('rLive', ['rAngular', 'AwesomeChartJS','Datatable']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', {controller:"HomeCtrl", templateUrl:'views/home.html'}).
            when('/data', {controller:"DataCtrl", templateUrl:'views/data.html'}).
            otherwise({redirectTo:'/'});
    }).directive('leaflet',function ($rootScope) {
        return {
            template:'<div class="map" ></div>',
            restrict:'E',
            replace:true,
            scope:{
                letters:"=letters",
                writers:"=writers"

            },
            link:function (scope, element, attrs) {
                var self = this;
                scope.markers = [
                ];
                L.Map = L.Map.extend({
                    openPopup:function (popup) {
                        //        this.closePopup();  // just comment this
                        this._popup = popup;

                        return this.addLayer(popup).fire('popupopen', {
                            popup:this._popup
                        });
                    }
                });

                scope.repaintMarkers = function () {
                    var layer = [];
                    if (scope.layers) {
                        scope.map.removeLayer(scope.layers);
                    }
                    var thickness = [
                    ];
                    _.each(scope.letters, function (letter) {
                        var start = scope.markers[Number(letter.from_id)];
                        var end = scope.markers[Number(letter.to_id)];
                        var latlngs = Array();
                        latlngs.push(start.getLatLng());
                        latlngs.push(end.getLatLng());
                        var uni = latlngs[0].lat + latlngs[0].lng + latlngs[1].lat + latlngs[1].lng;
                        if (!thickness[uni]) {
                            thickness[uni] = {
                                obj:latlngs,
                                count:0
                            };
                        }
                        thickness[uni].count += 1;
                    });

                    for (var i in thickness) {

                        var polygon = new L.polyline(thickness[i].obj, {color:'black', weight:thickness[i].count});
                        layer.push(polygon);
                    }
                    scope.layers = L.layerGroup(layer);
                    scope.layers.addTo(scope.map);
                }


                scope.map = new L.map(element[0], {
                    center:[51.505, -0.09]
                });

                var osmTile = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
                var osmCopyright = "Map data &copy; 2012 OpenStreetMap contributors";
                var osmLayer = new L.TileLayer(osmTile, { maxZoom:20, attribution:osmCopyright });
                scope.map.addLayer(osmLayer);
                scope.repaintMarkers();


            }
        };
    }).directive('d3bar', function () {
        return {
            restrict:'A',
            link:function (scope, element, attrs) {

               var data;
              var color = d3.scale.category20();
                var w = angular.element(element[0]).parent().width()-60;
                var h = angular.element(element[0]).parent().height()-60;

                var svg = d3.select("#" +attrs.id)
                    .append("svg")
                    .attr("width",w)
                    .attr("height",h)
                    .attr("style","margin-left:30px;");
                var first = true;
                var colorparse = function(color){
                    var colors = {
                        "red" : "#E74C3C",
                        "blue" : "#3498DB",
                        "yellow" : "#F1C40F",
                        "green" : "#2ECC71",
                        "orange" : "#E67E22"
                    };
                    return colors[color];
                }

               var setup = function(data){
                   var yScale = d3.scale.linear()
                       .domain([0, d3.max(data, function(d) { return d.value; })])
                       .range([0, 10]);
                    if(!first){
                        redraw(data);
                        return;
                    }
                   var temp = [];
                   for(var i in data){
                       temp.push(data[i]);
                   }
                   svg.selectAll("rect").data(temp)
                       .enter()
                       .append("rect")
                       .attr("x",function(d,i){
                           return i*(w/Object.size(data));
                       })
                       .attr("y",function(d,i){

                           return yScale(d.value);
                       })
                       .attr("width",function(){
                           return w/Object.size(data);
                       })
                       .attr("height",function(d){

                           return yScale(h);
                       })
                       .attr("fill",function(d,i){

                           return color(i);
                       });
                   first = false;
               }
               var redraw = function(data){

                   var temp = [];
                   for(var i in data){
                       temp.push(data[i]);
                   }
                   svg.selectAll("rect")
                       .data(temp)
                       .transition()
                       .duration(500)
                       .attr("y",function(d,i){

                           return h- d.value;
                       })
                       .attr("height",function(d){
                           return d.value;
                       })
               }
               scope.$watch(attrs.data,function(newdata){

                   if(newdata && (Object.size(newdata)>0 || newdata.length >0)){
                     console.log("Bar change",newdata);
                       setup(newdata);
                   }

               },true)


            }
        }
    }
).directive('d3pie', function () {
        return {
            restrict:'A',
            link:function (scope, element, attrs) {
                var dataset = {
                    apples: [53245, 28479, 19697, 24037, 40245],
                    oranges: [200, 200, 200, 200, 200]
                };

                var width = angular.element(element[0]).parent().width()-60;
                var height = angular.element(element[0]).parent().height()-60;
                var radius = Math.min(width, height) / 2;
                var path ;
                var color = d3.scale.category20();

                var pie = d3.layout.pie()
                    .sort(null)
                   .value(function(d){

                    return d.value;
                });

                var arc = d3.svg.arc()
                    .innerRadius(radius - 100)
                    .outerRadius(radius - 20);

                var svg = d3.select("#" + attrs.id).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

               // store the initial values

                //d3.selectAll("input").on("change", change);

               /** var timeout = setTimeout(function() {
                    d3.select("input[value=\"oranges\"]").property("checked", true).each(change);
                }, 2000);**/

                function change(data) {
                   try{
                       path = path.data(pie(data)); // update the data
                       path.transition().duration(100).attrTween("d", arcTween); // redraw the arcs
                   }catch(e){
                       scope.first = true;
                   }

                }
                var colorparse = function(color){
                    var colors = {
                        "red" : "#E74C3C",
                        "blue" : "#3498DB",
                        "yellow" : "#F1C40F",
                        "green" : "#2ECC71",
                        "orange" : "#E67E22"
                    };

                    return colors[color];
                }
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function(t) {
                        return arc(i(t));
                    };
                }
                function init(data){
                    path = svg.selectAll("path")
                        .data(pie(data))
                        .enter().append("path")
                        .attr("fill", function(d, i) { return colorparse(d.data.color); })
                        .attr("d", arc)
                        .each(function(d) { this._current = d; });
                }
                scope.first = true;
                scope.$watch(attrs.data,function(newvalue){
                    if(newvalue && Object.size(newvalue)> 0){
                        var temp = [];
                        for(var i in newvalue){
                            if(newvalue[i] == 0){
                                temp.push(1)
                            }else{
                                temp.push(newvalue[i]);
                            }

                        }
                        if(scope.first){
                            init(temp);
                            scope.first = false;
                        }else{
                            var allzero = true;
                            for(var i in temp){
                                if(temp[i] == 0){

                                    temp[i] = 1;
                                }
                            }

                                change(temp);


                        }
                    }
                },true)
            }
        }
    }
).directive('gauge', function () {
        return {
            restrict:'A',
            link:function (scope, element, attrs) {
                var gauge;

                function createGauge(name, label)
                {
                    var config =
                    {
                        size: 120,
                        label: label,
                        minorTicks: 5
                    }

                    config.redZones = [];
                    config.redZones.push({ from: 90, to: 100 });

                    config.yellowZones = [];
                    config.yellowZones.push({ from: 75, to: 90 });

                    gauge =  new Gauge(attrs.id, config);
                    //console.log(attrs.id);
                    gauge.render();
                }

                function createGauges()
                {
                    createGauge("cpu", "CPU");
                    createGauge("network", "Network");
                }

                function updateGauges()
                {
                    for (var key in gauges)
                    {
                        gauges[key].redraw(30 + 50 * Math.random() - 30 * Math.random());
                    }
                }

                function initialize()
                {
                    createGauges();
                    setInterval(updateGauges, 5000);
                }
                //console.log(attrs.id);
                createGauge(attrs.id, "Place");
                scope.$watch(attrs.data,function(newvalue){
                    //console.log(newvalue);
                    gauge.redraw(newvalue.value)
                },true);
            }
        }
    }
).directive('line', function () {
        return {
            restrict:'A',
            link:function (scope, element, attrs) {
                var element = element[0];
                var lineValues = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                var n = 40,
                    random = d3.random.normal(0, .2),
                    data = d3.range(n).map(random);

                var margin = {top: 10, right: 10, bottom: 20, left: 40},
                    width = 960 - margin.left - margin.right,
                    height = 100 - margin.top - margin.bottom;

                var x = d3.scale.linear()
                    .domain([0, lineValues.length])
                    .range([0, width]);

                var y = d3.scale.linear()
                    .domain([0, 100])
                    .range([height, 0]);

                var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d, i) { return x(i); })
                    .y(function(d, i) { return y(d); })
                var area = d3.svg.area()
                    .x(function(d) { return x(i); })
                    .y0(height)
                    .y1(function(d) { return y(d); });


                var svg = d3.select("#"+attrs.id).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.svg.axis().scale(x).orient("bottom"));

                svg.append("g")
                    .attr("class", "y axis")
                    .call(d3.svg.axis().scale(y).orient("left"));

                var path = svg.append("g")
                    .attr("clip-path", "url(#clip)")
                    .append("path")
                    .data([lineValues])
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("stroke",function(d,i){
                        return attrs.color;
                    });



                var redraw = function(){
                    //console.log("Redraw","initiated ")
                    // redraw the line, and slide it to the left

                    path

                        .transition()
                        .duration(4000)
                        .ease("linear")
                        .attr("d", line)
                        .attr("transform", null)
                        .attr("transform", "translate(" + x(-1) + ")");


                    // pop the old data point off the front

                        //lineValues.shift();


                }
                var colorparse = function(color){
                    var colors = {
                        "red" : "#E74C3C",
                        "blue" : "#3498DB",
                        "yellow" : "#F1C40F",
                        "green" : "#2ECC71",
                        "orange" : "#E67E22"
                    };

                    return colors[color];
                }

                scope.$watch(attrs.data,function(newvalue){
                    if(newvalue && newvalue.value){


                        //angular.element(element).css("stroke",colorparse(newvalue.color));
                        lineValues.push(newvalue.value);
                    }
                    redraw();
                },true);



            }
        }
    }
).directive('multiline', function () {
        return {
            restrict:'A',
            link:function (scope, element, attrs) {
                var margin = {top: 10, right: 10, bottom: 20, left: 40};
                var w = angular.element(element[0]).parent().width()-margin.left-margin.right-60;
                var h = angular.element(element[0]).parent().height()-margin.top-margin.bottom-60;
                console.log(w);
                var arrLineValues = [];
                var objLineValues = {};
                var first = true;
                var x, y,line,group,area;

                var svg = d3.select("#" + attrs.id).append('svg')
                    .attr("width", w+ margin.left + margin.right)
                    .attr("height", h + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;



                var colorparse = function(color){
                    var colors = {
                        "red" : "#E74C3C",
                        "blue" : "#3498DB",
                        "yellow" : "#F1C40F",
                        "green" : "#2ECC71",
                        "orange" : "#E67E22"
                    };

                    return colors[color];
                }
                var init = function(data){
                    //console.log("Init Data", data);
                    x = d3.scale.linear().domain([0,100]).range([0, w]);
                    y = d3.scale.linear().domain([0,100]).range([h,0]);
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + h + ")")
                        .call(d3.svg.axis().scale(x).orient("bottom"));
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(d3.svg.axis().scale(y).orient("left"));
                    line = d3.svg.line()
                        .interpolate("basis")
                        .x(function(d,i) { return x(i); })
                        .y(function(d) {return y(d.value);});
                    area = d3.svg.area()
                        .interpolate("basis")
                        .x(function(d,i) { return x(i); })
                        .y(function(d) {return y(d.value);});


                    group = svg.selectAll("path")
                        .data(arrLineValues)
                        .enter()
                        .append("g")
                        .attr("class","group");
                    group.append("path")
                        .attr("class","area")
                        .attr("d",function(d){return area(d.values)})
                        .attr("fill", function(d,i){
                            //console.log(arrLineValues[i]);
                            return colorparse(arrLineValues[i].values[arrLineValues[i].values.length-1].color);
                        });
                    group.append("path")
                        .attr("class","line")
                        .attr("d",function(d){return line(d.values)})
                        .style("stroke", function(d,i){
                            //console.log(arrLineValues[i]);
                            return colorparse(arrLineValues[i].values[arrLineValues[i].values.length-1].color);
                        });

                    group.append("text")
                        .attr("transform", function(d,i) { return "translate(" + x(i) + "," + y(d.value) + ")"; })
                        .attr("x",3)
                        .attr("dy",".35em")
                        .text(function(d){return d.color});
                }
                var redraw = function(data){
                    //console.log(arrLineValues);
                    svg.selectAll('.line')
                        .data(arrLineValues)

                        .transition()
                        .duration(1000)
                        .ease("linear")
                        .attr("d", function(d){return line(d.values)})
                        .attr("transform", "translate(" + x(-1) + ")");
                    svg.selectAll('.area')
                        .data(arrLineValues)
                        .attr("d", function(d){return area(d.values)})
                        .transition()
                        .duration(1000)
                        .ease("linear")
                        .attr("transform", "translate(" + x(-1) + ")");
                }
                scope.$watch(attrs.data,function(newvalue){
                    for(var i in newvalue){
                        if(!objLineValues[i]){
                           objLineValues[i] = {
                               "color" :i.color,
                               "values" : [
                                   {
                                       value:0
                                   },
                                   {
                                       value:0
                                   }
                               ]
                           };
                        }
                        objLineValues[i].values.push(angular.copy(newvalue[i]));
                    }
                    arrLineValues = [];
                    for(var i in objLineValues){
                        if(objLineValues[i].values.length>100){
                            objLineValues[i].values.shift();
                        }

                        arrLineValues.push(angular.copy(objLineValues[i]));
                    }
                    if(first && arrLineValues.length>0){
                        init(arrLineValues);
                        first = false;
                    }else if (arrLineValues.length>0){
                        //console.log("Redraw","now");
                        redraw(arrLineValues);
                    }
                },true)

            }
        }
    }
).directive('map', function () {
        return {
            restrict:'A',
            link:function (scope, element, attrs) {
                /**layout**/
                var margin = {top: 0, right: 0, bottom: 0, left: 0};
                var w = angular.element(element[0]).parent().width()-margin.left-margin.right-0;
                var h = angular.element(element[0]).parent().height()-margin.top-margin.bottom-30;
                /**map options**/
                scope.options = {
                    type : "world",
                    value : "value",
                    name : "name",
                    location : "loc",
                    goal : "goal",
                    lon : "lon",
                    lat : "lat",
                    connect : true,
                    packages : true,
                    description : "description",
                    image : undefined

                }
                scope.$watch(attrs.options,function(newvalue){
                    scope.options = _.extend(scope.options, newvalue);
                })
                scope.maptypes = {
                    "world" :"/vendors/map/json/world-50m.json"
                }
                scope.morve;
                scope.firstMorve = true;
                var projection = d3.geo.mercator()
                    .translate([0, 0]);

                var zoom = d3.behavior.zoom()
                    .scaleExtent([1,30])
                    .on("zoom", move);

                var path = d3.geo.path()
                    .projection(projection);



                var svg = d3.select("#" + attrs.id).append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .append("g")
                    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
                    .call(zoom);

                var g = svg.append("g");

                svg.append("rect")
                    .attr("class", "overlay")
                    .attr("x", -w / 2)
                    .attr("y", -h / 2)
                    .attr("width", w)
                    .attr("height", h);

                d3.json(scope.maptypes[scope.options.type], function(error, world) {
                    var countries = topojson.feature(world, world.objects.countries);
                    g.selectAll("path")
                        .data(countries.features.filter(function(d) { return d.id % 1000; }))
                        .enter().append("path")
                        .attr("class", "land")
                        .attr("d", path)
                        .append("title")
                        .text(function(d) { return d.properties.name; });
                    g.append("path")
                        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
                        .attr("class", "boundary")
                        .attr("d", path);
                    if(scope.morve){
                        drawpoints();
                    }
                    scope.firstMorve = false;
                });
                var first = true;
                var drawpoints = function(){
                    if(first){
                        g.selectAll(".animation")
                            .data(scope.morve)
                            .enter().append("svg:circle")
                            .attr("transform", function(d) {
                               // console.log(d)
                                return "translate(" + projection([d.location[scope.options.lon],
                                    d.location[scope.options.lat]]) + ")";
                            })
                            .attr("r", function(d) { return d.value/10; })
                            .attr("class","animation");
                        g.selectAll(".location")
                            .data(scope.morve)
                            .enter().append("svg:circle")
                            .attr("transform", function(d) {
                                //console.log(d)
                                return "translate(" + projection([d.location[scope.options.lon],
                                    d.location[scope.options.lat]]) + ")";
                            })
                            .attr("r", function(d) { return d.value/10; })
                            .attr("class","location")
                            .on("click", function(d,i) { if(scope.options.onclick){
                                //console.log(scope.options);
                                scope[scope.options.onclick](d,i,event);
                            }});
                        g.selectAll("text")
                            .data(scope.morve)
                            .enter()
                            .append("text")
                            .attr("transform", function(d) {
                                //console.log(d)
                                return "translate(" + projection([d.location[scope.options.lon],
                                    d.location[scope.options.lat]]) + ")";
                            })
                            .text(function(d) {
                                return d.value;
                         });
                        if(scope.options.connect){
                            var temp = [];
                            for(var i in scope.morve){

                                temp.push([[scope.morve[i].location[scope.options.lon],scope.morve[i].location[scope.options.lat]],
                                    [scope.morve[i].goal[scope.options.lon],scope.morve[i].goal[scope.options.lat]]])
                            }
                            g.selectAll(".arc")
                                .data(temp)
                                .enter().append("path")
                                .attr("class","arc")
                                .attr("d",function(d){
                                            //console.log(d);
                                            return path({
                                                type: "LineString",
                                                coordinates: d
                                            });

                                });


                        }
                        first = false;
                    }else{
                        g.selectAll(".animation")
                            .data(scope.morve)
                            .transition()
                            .duration(1000)
                            .ease("linear")
                            .attr("r", function(d) { return d.value/2; })
                            .style("opacity","0")
                            .transition()
                            .attr("r", function(d) { return d.value/10; })
                            .transition()
                            .style("opacity","1");
                        g.selectAll(".location")
                            .data(scope.morve)
                            .transition()
                            .duration(500)
                            .ease("linear")
                            .attr("r", function(d) { return d.value/8; })
                            .transition()
                            .duration(200)
                            .ease("linear")
                            .attr("r", function(d) { return d.value/10; });
                        if(scope.options.packages){
                            var circle = svg.selectAll(".package")
                                .data(scope.morve);
                            circle.exit().remove();
                            if(!scope.options.image){
                                g.selectAll(".p")
                                    .data(scope.morve)
                                    .enter().append("svg:circle")
                                    .attr("transform", function(d) {
                                        //console.log(d)
                                        return "translate(" + projection([d.location[scope.options.lon],
                                            d.location[scope.options.lat]]) + ")";
                                    })
                                    .attr("r", function(d) { return 0.8; })
                                    .attr("class","flyingpackage")
                                    .transition()
                                    .duration(1000)
                                    .ease("linear")
                                    .attr("transform", function(d) {

                                        return "translate(" + projection([d.goal[scope.options.lon],
                                            d.goal[scope.options.lat]]) + ")";
                                    })
                                    .transition()
                                    .style("opacity","0")
                                    .attr("class","package");
                            }else{
                                g.selectAll(".p")
                                    .data(scope.morve)
                                    .enter().append("image")
                                    .attr("xlink:href",scope.options.image)
                                    .attr("width",15)
                                    .attr("height",7)
                                    .attr("transform", function(d) {
                                        //console.log(d)
                                        return "translate(" + projection([d.location[scope.options.lon],
                                            d.location[scope.options.lat]]) + ")";
                                    })
                                    .attr("class","flyingpackage")
                                    .transition()
                                    .duration(1000)
                                    .ease("linear")
                                    .attr("transform", function(d) {
                                        //console.log(d)
                                        return "translate(" + projection([d.goal[scope.options.lon],
                                            d.goal[scope.options.lat]]) + ")";
                                    })
                                    .transition()
                                    .style("opacity","0")
                                    .attr("class","package");
                            }




                        }
                        g.selectAll("text")
                            .data(scope.morve)
                            .transition()
                            .duration(500)
                            .ease("linear")
                            .text(function(d) {
                                return d.value;
                        });

                    }

                }
                scope.$watch(attrs.data,function(newvalue){
                    if(!newvalue){
                        return;
                    }
                    var morve = [];
                    for(var i in newvalue){
                        var temp = {};
                        temp.value = newvalue[i][scope.options.value];
                        temp.name = newvalue[i][scope.options.name];
                        temp.location = newvalue[i][scope.options.location];
                        temp.goal = newvalue[i][scope.options.goal];
                        temp.description = newvalue[i][scope.options.description];
                        morve.push(temp);
                    }
                    scope.morve = morve;
                    if(scope.firstMorve){
                        return;
                    }
                    drawpoints();


                },true)
                function move() {
                    var t = d3.event.translate,
                        s = d3.event.scale;
                    t[0] = Math.min(w / 2 * (s - 1), Math.max(w / 2 * (1 - s), t[0]));
                    t[1] = Math.min(h / 2 * (s - 1) + 230 * s, Math.max(h / 2 * (1 - s) - 230 * s, t[1]));
                    zoom.translate(t);
                    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
                }



            }
        }
    }
).directive('traffic', function () {
        return {
            restrict:'A',
            link:function (scope, element, attrs) {
                /**layout**/
                var margin = {top: 0, right: 0, bottom: 0, left: 0};
                var w = angular.element(element[0]).width()-margin.left-margin.right-0;
                var h = angular.element(element[0]).height()-margin.top-margin.bottom-30;
                /**map options**/
                scope.options = {
                    value : "value",
                    name : "name",
                    background : "#2C3E50",
                    colors : {
                        green : "#16A085",
                        orange : "#D35400",
                        red : "#C0392B"
                    },
                    fade :.1,
                    thresholds : {
                        green : 50,
                        orange : 80,
                        red : 100
                    },
                    value : "value"
                }
                scope.$watch(attrs.options,function(newvalue){
                    scope.options = _.extend(scope.options, newvalue);
                });
                var svg = d3.select(element[0]).append("svg")
                    .attr("width", w)
                    .attr("height", h)

                var g = svg.append("g");
                scope.color = [scope.options.colors.red,scope.options.colors.orange,scope.options.colors.green];
                scope.thresholds = [scope.options.thresholds.red,scope.options.thresholds.orange,scope.options.thresholds.green];
                var init = function(){
                    //console.log("Data",scope.data);
                    g.selectAll("circle").data(scope.data).enter()
                        .append("svg:circle")
                        .attr("r", function(d) {
                            //console.log(d);
                            return ((h/3)/2)-((10*scope.data.length)/4);
                        })
                        .attr("cx",function(d,i){
                            return w/2;
                        })
                        .attr("cy",function(d,i){
                            return ((((h/3))*i))+(2*i)+((h/3)/2);
                        })
                        .attr("fill",function(d,i){
                            return scope.color[i];
                        })
                        .attr("opacity",function(d,i){
                            var high = scope.thresholds[i] ;
                            var lower = scope.thresholds[i+1] || 0 ;
                            console.log("Low",lower);
                            console.log("High" ,high);
                            console.log("Value", d.value);
                            if(d.value>=lower && d.value<=high){
                                return 1;
                            }else{
                                return scope.options.fade;
                            }
                        })
                }
                var update = function(){
                    g.selectAll("circle").data(scope.data)
                        .transition()
                        .ease("linear")
                        .attr("opacity",function(d,i){
                            var high = scope.thresholds[i] ;
                            var lower = scope.thresholds[i+1] || 0 ;

                            if(d.value>lower && d.value<=high){
                                return 1;
                            }else{
                                return scope.options.fade;
                            }
                        })
                }
                var first = true;
                scope.$watch(attrs.data,function(newvalue){
                    if(newvalue && first){
                        //console.log(newvalue);
                        scope.data = [angular.copy(newvalue),angular.copy(newvalue),angular.copy(newvalue)];
                        init();
                        first = false;

                    }else{
                        scope.data = [angular.copy(newvalue),angular.copy(newvalue),angular.copy(newvalue)];
                        update();
                    }
                },true);

            }
        }}
).directive('tree', function () {
    return {
      restrict:'A',
      link:function (scope, element, attrs) {
        /**layout**/
        var margin = {top: 0, right: 0, bottom: 0, left: 0};
        var w = angular.element(element[0]).width();
        var h = 400;
        /**map options**/
        scope.options = {
          value : "value",
          label : "name",
          parent : "parent",
          children : "children"
        }
        scope.$watch(attrs.options,function(newvalue){
          scope.options = _.extend(scope.options, newvalue);
        });
        var zoom = d3.behavior.zoom()
          .scaleExtent([-10,30])
          .on("zoom", move);
        var svg = d3.select(element[0]).append("svg")
          .attr("width", w)
          .attr("height", h);

        var g = svg.append("g");
        g.call(zoom)
          .on("zoom", move);
        function move() {
          console.log(d3.event);
          var t = d3.event.translate,
            s = d3.event.scale;
          t[0] = Math.min(w / 2 * (s - 1), Math.max(w / 2 * (1 - s), t[0]));
          t[1] = Math.min(h / 2 * (s - 1) + 230 * s, Math.max(h / 2 * (1 - s) - 230 * s, t[1]));
          zoom.translate(t);
          g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
        }

          var i = 0,
          root;
        var tree = d3.layout.tree()
          .size([h, w]);

        var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });


        scope.$watch(attrs.data,function(newvalue){
          root ={
              "name" : "root",
              "children" : []

          }
          if(_.isObject(newvalue)){
            var cur = root.children;
            for(var i in newvalue){
              var temp  = {
                "name" : i,
                "children" : []
              }
              rec(temp.children,newvalue[i],0);
              cur.push(temp);
            }
          }
          root.x0 = h / 2;
          root.y0 = 0;

          function toggleAll(d) {
            if (d.children) {
              d.children.forEach(toggleAll);
              toggle(d);
            }
          }

          // Initialize the display to show a few nodes.
          console.log(root);
          root.children.forEach(toggleAll);

          update(root);
        },true);
        function rec(root,obj,level){
            for(var i in obj){
              var temp = {
                "name" : i,
                "level" : level
              }
              if(_.isObject(obj[i])){
                temp.name  = "["+ i +"]"
                temp.children = [];
                rec(temp.children,obj[i],level+1);
              }else{
                temp.name = "'" + obj[i] +"'";
              }
              root.push(temp)
            }
            return root;
        }


        function update(source) {
          var duration = d3.event && d3.event.altKey ? 5000 : 500;

          // Compute the new tree layout.
          console.log(root);
          var nodes = tree.nodes(root).reverse();

          // Normalize for fixed-depth.
          nodes.forEach(function(d) { d.y = d.depth * 180; });

          // Update the nodes…
          var node = g.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

          // Enter any new nodes at the parent's previous position.
          var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function(d) { toggle(d); update(d); });

          nodeEnter.append("svg:circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
            .style("stroke", function(d) { return d.children ? "lightsteelblue" : "#fff"; });

          nodeEnter.append("svg:text")
            .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1e-6);

          // Transition nodes to their new position.
          var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

          nodeUpdate.select("circle")
            .attr("r", 6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
            .style("stroke", function(d) { return d.children ? "lightsteelblue" : "#fff"; });

          nodeUpdate.select("text")
            .style("fill-opacity", 1);

          // Transition exiting nodes to the parent's new position.
          var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

          nodeExit.select("circle")
            .attr("r", 1e-6);

          nodeExit.select("text")
            .style("fill-opacity", 1e-6);

          // Update the links…
          var link = g.selectAll("path.treelink")
            .data(tree.links(nodes), function(d) { return d.target.id; });

          // Enter any new links at the parent's previous position.
          link.enter().insert("svg:path", "g")
            .attr("class", "treelink")
            .attr("d", function(d) {
              var o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
            })
            .transition()
            .duration(duration)
            .attr("d", diagonal);

          // Transition links to their new position.
          link.transition()
            .duration(duration)
            .attr("d", diagonal);

          // Transition exiting nodes to the parent's new position.
          link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
            .remove();

          // Stash the old positions for transition.
          nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
          });
        }

// Toggle children.
        function toggle(d) {

          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {

            d.children = d._children;
            d._children = null;
            scope.$emit("propertyselected",d);
          }
        }




      }
    }}
).directive("network",function(){
    return {
      restrict:'A',
      link:function (scope, element, attrs) {
        /**layout**/
        var margin = {top: 0, right: 0, bottom: 0, left: 0};
        var w = angular.element(element[0]).width();
        var h = 800;
        var self  = this;
        self.data;
        self.links;
        /**map options**/
        scope.options = {
          value : "value",
          label : "name",
          parent : "parent",

          children : "children"
        }
        scope.$watch(attrs.options,function(newvalue){
          scope.options = _.extend(scope.options, newvalue);
        });
        var node,
          link,
          root;

        var force = d3.layout.force()
          .on("tick", tick)
          .size([w, h]);
        var zoom = d3.behavior.zoom()
          .scaleExtent([1,30])
          .on("zoom", move);
        var vis = d3.select(element[0]).append("svg:svg")
          .attr("width", w)
          .attr("height", h)
          .call(zoom);
        function move() {
          console.log(d3.event);
          var t = d3.event.translate,
            s = d3.event.scale;
          t[0] = Math.min(w / 2 * (s - 1), Math.max(w / 2 * (1 - s), t[0]));
          t[1] = Math.min(h / 2 * (s - 1) + 230 * s, Math.max(h / 2 * (1 - s) - 230 * s, t[1]));
          zoom.translate(t);
          vis.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
        }
        var tooltip = d3.select("body")
          .append("div")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("visibility", "hidden")
          .text("a simple tooltip");
        function update() {
          var i = getData();
          var nodes = i.data,
            links = i.links;

          // Restart the force layout.
          force
            .nodes(nodes)
            .links(links)
            .charge(20)
            .linkDistance(10)
            .start();

          // Update the links…
          link = vis.selectAll("line.link")
            .data(links);

          // Enter any new links.
          link.enter().insert("svg:line", ".node")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

          // Exit any old links.
          link.exit().remove();

          // Update the nodes…
          node = vis.selectAll("circle.node")
            .data(nodes)
            .style("fill", color);

          // Enter any new nodes.
          node.enter().append("svg:circle")
            .attr("class", "node")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 10; })
            .style("fill", color)
            .style("stroke" , function(d){
              console.log(d.children);
              if(d.children){
                return "black"
              }
              return "transparent";
            })
            .on("mouseover", function(d){return tooltip.style("visibility", "visible");})
            .on("mousemove", function(d){
              tooltip.text(d.name); tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
              return true;})
            .on("mouseout", function(d){return tooltip.style("visibility", "hidden");})

            .on("click", click)
            .call(force.drag);

          // Exit any old nodes.
          node.exit().remove();
        }

        function tick() {
          link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

          node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        }
        function flatten(obj){
         // console.log(obj);
          if(obj.children){
            for(var i in obj.children){

              flatten(obj.children[i]);
            }
            obj._children = angular.copy(obj.children);
            obj.children = undefined;
          }
          //console.log(obj.children);
          return obj;
        }
        function recurse(obj,parent,data,links){
            data.push(obj);
            links.push({
              "source" : parent,
              "target" : data.length - 1
            });
            parent = data.length - 1;
            for(var o in obj.children){
                recurse(obj.children[o],parent,data,links);
            }
            return obj;
        }
        function getData(){
          var temp = [];
          var links = [];
          var hash = {

          }
          for(var i in self.data){
             temp.push(self.data[i]);
             var pParent = temp.length -1;
             hash[i] = pParent;
             for(var o in self.data[i].children){
                recurse(self.data[i].children[o],pParent,temp,links);
             }

          }
          for(var o in self.links){
            links.push({
              "source" : hash[self.links[o].source],
              "target" : hash[self.links[o].target]
            })
          }
          return {
            "data" : temp,
            "links" : links
          };
        }
// Color leaf nodes orange, and packages white or blue.
        function color(d) {
          return d._children ? "#3182bd" : d.children ? "#2ECC71" : "#fd8d3c";
        }

// Toggle children on click.
        function click(d) {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update();
        }

// Returns a list of all nodes under the root.



        scope.$watch(attrs.data,function(newvalue){
            if(newvalue){
              self.data = newvalue;
              if(self.data && self.links){
                if(_.keys(self.data).length > 0 && _.keys(self.links).length > 0){
                  root = self.data;
                  for(var i in self.data){
                    flatten(self.data[i]);
                  }
                  update();
                }
              }

            }

        },true);
        scope.$watch(attrs.links,function(newvalue){
          //console.log(newvalue);
            if(newvalue){
              self.links = newvalue;
              if(self.data && self.links){
                if(_.keys(self.data).length > 0 && _.keys(self.links).length > 0){
                  root = self.data;
                  for(var i in self.data){
                    flatten(self.data[i]);
                  }

                  update();
                }
              }
            }
        },true);



      }
    }
});

