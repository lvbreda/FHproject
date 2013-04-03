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
        uri:"localhost:27017/testdb"
    }
});
db = db.createDB();


var dancers = rest.factory(db, "Dancers", true, {});
var users = rest.factory(db, "Users", true, {});

