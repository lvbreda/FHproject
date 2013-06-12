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

db.collection("Items").update({
        value:{$gt:0}},{$set:{value:0}}
,true,function(err,resul){ console.log(err);});


var fi = function(){
    db.collection("Items").update({random:{$gt:Math.random()}},{$set:{value:Math.floor(Math.random()*101)}},{multi: true}
        ,function(err,result){ console.log(err);});
    counter += 1;
    if(counter<5000){
        setTimeout(fi,2000);
    }
}
setTimeout(fi,2000);