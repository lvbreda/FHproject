/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 02/04/13
 * Time: 12:08
 * To change this template use File | Settings | File Templates.
 */
var db = require('./rDb/factory.js');
var rest = require('./rRest/factory.js');

db.init({
    type:"mongodb",
    details:{
        uri:"127.0.0.1:27017",
        dbname : "cais_0"
    },
    reactive : true
});
db = db.createDB();


var dancers = rest.factory(db, "agent", true, {});

