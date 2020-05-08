var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var portServer = 4242;
MongoClient.connect(url,{useUnifiedTopology: true}, function (err, db) {
    if (err) {
        throw err;
    }
    console.log("Database created!");
    var express = require('express');
    var app = express();

    app.get('/', function (req, res) {
        res.send('Hello World');
    });

    var server = app.listen(portServer, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Example app listening at http://%s:%s", host, port)
    })
    //db.close();
});