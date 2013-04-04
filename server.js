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
        uri:"192.168.242.132:27017",
        dbname : "testdb"
    },
    reactive : true
});
db = db.createDB();


var dancers = rest.factory(db, "Dancers", true, {});
var users = rest.factory(db, "Users", true, {});

