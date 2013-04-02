var utils = require("./utils.js");
exports.factory = function (express, db, collection, options) {
    var _collection = collection;
    var _db = db.createCollection(_collection);


    if (options.unique) {
        _collection = options.unique;
    }
    express.get("/api/" + _collection, function (req, res) {
        var _queryVariables = req.query;
        if (_queryVariables && _queryVariables.length != 0) {
            _db.find(_queryVariables, {}).then(function (result) {
                res.json(200, result);
            });
        } else {
            _db.find({}, req.options.fields).then(function (result) {
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
        _db.remove({_id:req.params.id}).then(function (result) {
            res.json(200, result);
        });
    });
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
