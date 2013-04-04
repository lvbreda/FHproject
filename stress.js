/**
 * Created with JetBrains WebStorm.
 * User: landervanbreda
 * Date: 04/04/13
 * Time: 14:25
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongoskin');
var counter = 0;
var db = mongo.db("192.168.242.132:27017" + "/" + "testdb", {w:1});
var fi = function(){
    db.collection("Users").insert({
        "name" : "bomen"+ counter
    },{}, function (err, result) {

    });
    counter += 1;
    if(counter<5000){
        setTimeout(fi,250);
    }
}
setTimeout(fi,250);