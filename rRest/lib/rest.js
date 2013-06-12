var utils = require("./utils.js");

/*
  The factory for creating a RESTful front for a certain collection :
    GET: This has a bit other syntaxis then normal REST server the queries or being send if GET style not route style
      fe : users?_id=32EZ3
           users?name=lander
    POST: Normal REST syntax
        POST users/:id
    DELETE: Normal REST syntax
        DELETE users/:id
    PUT : Normal REST syntax
        PUT users/:id
            Body : application/json
              {
                updatevalue: 1
                updatevalue: 2
                updatevalue: 3
              }
 */
exports.factory = function (express, db, collection, options,queries) {
    var self = this;
    var _collection = collection;
    var _db = new db.createCollection(_collection);
    var socketserver = options.socketserver;
    var pubQueries = queries;

    express.get("/api/" + _collection, function (req, res) {
        var _queryVariables = req.query;
        for(var i in req.query){
          if(!isNaN(Number(req.query[i]))){
            req.query[i] = Number(req.query[i]);
          }
        }
        if (_queryVariables && _queryVariables.length != 0) {
            pubQueries.addToQuery(req.cookies['express.sid'],_queryVariables);
            _db.find(_queryVariables,{$limit:100}).then(function (result) {
              console.log(result);
                res.json(200, result);
            });
        } else {

            _db.find({}, req.options.fields).then(function (result) {
              console.log("Sending back");
                res.json(200, result);
            });
        }
    });
    express.post("/api/" + _collection, function (req, res) {
        _db.insert(req.body, {}).then(function (result) {

            res.json(200, result);
        });
    });
    express.put("/api/" + _collection + "/:id", function (req, res) {
        _db.update({_id:req.params.id}, {$set:utils.cleanObject(req.body)}).then(function (result) {
            res.json(200, result);
        });
        ;
    });
    express.delete("/api/" + _collection + "/:id", function (req, res) {
        _db.remove({id:req.params.id}).then(function (result) {
            res.json(200, result);
        });
    });
  /*
    This is the location for custom routes past to the options object as customRoute:
      [
        {
          type: POST/GET/DELETE
          url : /api/fh , /fh/random
          query : {
                      name: Lander
                  }
          queryType : find,remove,update
          options: {
                      name: FH_Lander   This options array can also be used for limits or anything in a find ,
                      now it is used to give parameters to the update function (fixed update,buh)
           }
        }
      ]
   */
    if (options.customRoutes) {
        options.customRoutes.each(function (route) {
            express[route.type](route.url, function (req, res) {
                var query = route.query;
                var queryType = route.queryType;
                var options = route.options;
                _db[queryType](query, options).then(function (result) {
                    res.json(200, result);
                })
            });
        })
    }
}
