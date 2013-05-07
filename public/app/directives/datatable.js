/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 25/04/13
 * Time: 14:09
 * To change this template use File | Settings | File Templates.
 */
(function(window,$){
    var options = {

    }
    var $compile;
    var setCompile = function(a){
      $compile = a;
    }
    angular.module('Datatable', []).directive('datatable',['$http','$templateCache','$compile', function ($http,$templateCache,$compile) {
            return {
                restrict:'E',
                scope : {
                  "data" : "=",
                  "options" : "="
                },
                link:function (scope, element, attrs) {
                    setCompile($compile);

                    scope.dataTable = DataTableFactory().create(scope,$http,scope.data,scope.options,$templateCache);
                    console.log(scope.dataTable);
                  angular.element(element[0]).append(
                       scope.dataTable.getElement()
                    )
                }
            }
        }]
    );


    /**Objects**/
    var DataTable = function(scope,$http,data,options,$templateCache){
      var self = this;
      self.element = angular.element("<table class='table table-bordered datatable'></table>");
      self.header;
      self.body;
      self.init = function(){
          create(data,options);
          self.element.append(self.header.getElement());
          self.element.append(self.body.getElement());
      }
      self.update = function(data){

      }
      function create(data,options){
        self.header = HeaderFactory().create(scope,$http,data,options,$templateCache);
        self.body = BodyFactory().create(scope,$http,data,options,$templateCache);
      }

      self.getElement = function(){
        return self.element;
      }
      self.init();
      return self;
    }
    /*
      $http the $http provider for requests
      header [] with all the header name.
     */
    var Header = function(scope,$http,headers,$templateCache){
        var self = this;
        self.element = angular.element("<thead></thead>");
        self.init = function(){
            if(!scope.headers){
              scope.headers = headers;
            }
            $http.get('app/directives/DataViews/header.html', {cache:$templateCache}).success(function(result){
                self.element.html(result);
                $compile(self.element.contents())(scope);
            });
        }
        self.update = function(headers){
            angular.copy(headers,scope.headers);
        }
        self.getElement = function(){
            return self.element;
        }
        self.init();
        return self;
    }
    var Body = function(scope,$http,data,options,$templateCache,old){
        var self = this;
        self.element = angular.element("<tbody></tbody>");
        self.init = function(){
          scope.rows = data;
          scope.onclick = function($event){

            if(angular.element($event.target).hasClass("expand") && !angular.element($event.target).hasClass("open")){
              var row = angular.element("<tr></tr>");
              var td = angular.element("<td></td>")
              td.attr("colspan",""+ angular.element($event.target).parent("td").parent("tr").find("td").length);
              var id = angular.element($event.target).parent("td").attr('id');
              //console.log(old[id]);
              for(var i in old[id]){
                var temp = old[id][i];
                if(_.isObject(temp)){
                  var dbTable = new DataTableFactory().create(scope.$new(true),$http,temp,options,$templateCache);
                  td.append(dbTable.getElement());
                  console.log(dbTable.getElement().html());
                }
              }
              row.addClass("datatable_info");
              row.append(td);
              angular.element($event.target).addClass("open");
              angular.element($event.target).removeClass("icon-plus-sign-alt");
              angular.element($event.target).addClass("icon-minus-sign");
              angular.element($event.target).parent("td").parent("tr").after(
                row
              );
            }else{
              angular.element($event.target).removeClass("open");
              angular.element($event.target).addClass("icon-plus-sign-alt");
              angular.element($event.target).removeClass("icon-minus-sign");
              angular.element($event.target).parent("td").parent("tr").next(".datatable_info").remove();
            }
          }
          $http.get('app/directives/DataViews/body.html', {cache:$templateCache}).success(function(result){
            self.element.html(result);
            $compile(self.element.contents())(scope);
          });
        }
        self.update = function(){

        }
        self.getElement = function(){
          return self.element;
        }
        self.init();
        return self;
    }
    var Row = function($templateCache){
        var self = this;
        self.init = function(){
            $http.get('app/directives/DataViews/row.html', {cache:$templateCache});
        }
        self.update = function(){

        }
        self.init();
        return self;
    }
    var Cell = function($templateCache){
        var self = this;
        self.init = function(){
            $http.get('app/directives/DataViews/cell.html', {cache:$templateCache});
        }
        self.update = function(){

        }
        self.init();
        return self;
    }
    var Footer = function($templateCache){
        var self = this;
        self.init = function(){
            $http.get('app/directives/DataViews/footer.html', {cache:$templateCache});
        }
        self.update = function(){

        }
        self.init();
        return self;
    }
    var Search = function($templateCache){
        var self = this;
        self.init = function(){
            $http.get('app/directives/DataViews/search.html', {cache:$templateCache});
        }
        self.update = function(){

        }
        self.init();
        return self;
    }
    var Pagination = function($templateCache){
        var self = this;
        self.init = function(){
            $http.get('app/directives/DataViews/pagination.html', {cache:$templateCache});
        }
        self.update = function(){

        }
        self.init();
        return self;
    }
    /**Factories**/
    var DataTableFactory = function(){
      var self = this;
      self.create = function(scope,$http,data,options,$templateCache){
        return new DataTable(scope,$http,data,options,$templateCache);
      }
      return self;
    }
    var HeaderFactory = function(){
      var self = this;
      self.create = function(scope,$http,data,options,$templateCache){
        var headers = ["*"];
        if(options.vertical == true || !angular.isArray(data)){
          headers.push("property");
          headers.push("value");
        }else{
          var keys = _.keys(data[0]);
          for(var i = 0; i< keys.length;i++){
            headers.push(keys[i]);
          }
          //angular.copy(_.keys(data[0]),headers );
        }
        return new Header(scope,$http,headers,$templateCache);
      }
      return self;
    }
    var BodyFactory = function(){
      var self = this;
      self.create = function(scope,$http,data,options,$templateCache){
        var temp = []
        console.log(!angular.isArray(data));
        for(var i in data){
          var t = [];
          if(!angular.isArray(data)){
            t.push("");
            t.push(i);
            if(angular.isObject(data[i])){
              t[0] = "<i class='icon-plus-sign-alt expand' ></i>";
              t.push("<i class='icon-asterisk'></i>");
            }else{
              t.push(data[i]);
            }
          }else{
            for(var o in scope.headers){
              if(angular.isObject(data[i][scope.headers[o]])){
                t[0] = "<i class='icon-plus-sign-alt expand' ></i>";
                t.push("<i class='icon-asterisk'></i>");
              }else{
                t.push(data[i][scope.headers[o]]);
              }

            }
          }

          temp.push(t);
        }
        var list = temp;

        return new Body(scope,$http,list,options,$templateCache,data);
      }
      return self;
    }
})(window,jQuery)
