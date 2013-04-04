FHproject
=========

#YARR(f) , Yet Another Random Realtime (framework)
 Made by : Lander Van Breda && Karel Vrancken

##Usage:

###DB connection

    db.init({
        type:"mongodb",
        details:{
            uri:"192.168.242.132:27017",
            dbname : "testdb"
        },
        reactive : true
    });
    db = db.createDB();

###Normal Server Rest-endpoint

    //rest.factory(db,"Your collection name",false,options(Special endpoints));
    var users = rest.factory(db, "Users", false, {});

###Realtime REST endpoint

    //rest.factory(db,"Your collection name",true,options(Special endpoints));
    var users = rest.factory(db, "Users", true, {});

###Frontend

    Endpoint("Users", true).get({});
    Endpoint("Users", true).get({username:"Lander"});
    Endpoint("Users", true).get({username:"Karel"});

##Disclaimer:

To log external changes to the database the system uses Mongodb's oplog at the moment. To achieve this run you mongodb
with atleast 1 replicationset (Certainly a good practice)
