const mongoose = require('mongoose');
var url = "mongodb://localhost:27017/mydb";
var portServer = 4242;

const bodyParser = require('body-parser');
const cors = require('cors');


let User = require('./user.model');
// C'est moogoose qui gère la connexion
mongoose.connect(url,{useUnifiedTopology: true}, function (err, db) {
    if (err) {
        throw err;
    }
    console.log("Database created!");
    var express = require('express');
    var app = express();
    const userRoutes = express.Router();


    app.use(cors());
    app.use(bodyParser.json());
    // Fait qu'on peut utiliser req.body avec les objets !
    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true
    }));
    app.set('view engine', 'ejs');

    app.get('/', function (req, res) {
        res.send('Hello World');
    });

    userRoutes.route('/register').get(function(req, res) {
        res.render('register');
    });


    userRoutes.route('/register').post(function(req, res) {
        console.log(req.body.login);
        let user = new User(req.body);
        console.log(user);
        user.save()
            .then(user => {
                res.render('register');
                //res.status(200).json({'todo': 'todo added successfully'});
            })
            .catch(err => {
                res.render('register');
                //res.status(400).send('adding new todo failed');
            });
    });

    app.use(userRoutes);

    var server = app.listen(portServer, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Example app listening at http://%s:%s", host, port)
    })
    //db.close();
});