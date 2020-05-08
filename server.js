const mongoose = require('mongoose');
// Mondule crypto
const crypto = require('crypto')

var url = "mongodb://localhost:27017/mydb";
var portServer = 4242;

const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');


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

    // configuration pour la session
    app.use(cookieParser());
    app.use(session({secret: "Shh, its a secret!"}));

    app.get('/', function (req, res) {
        res.send('Hello World');
    });

    userRoutes.route('/register').get(function(req, res) {
        res.render('register');
    });

    userRoutes.route('/register').post(function(req, res) {
        console.log(req.body.login);
        let user = new User(req.body);
        let errors = [];

        if(user.password != req.body.confirm_password){
            errors.push("Mot de passe pas identique");
        }
        // TODO les tests qui vont bien.
        // TODO Vérifier que le login n'est pas déjà utiliser.
        User.find({ login: req.body.login }, function(err, users) {
            // users liste des users qui match (normalement qu'un seul)
            if (users.length == 0) {
                // Faire une fonction ?
                console.log(user);
                if (errors.length > 0) {
                    res.render('register', {'errors': errors});
                }
                // On crypte le mo de passe avant la sauvegarde
                user.password = toSha1(user.password);
                user.save()
                    .then(user => {
                        res.redirect('/login');
                        //res.status(200).json({'todo': 'todo added successfully'});
                    })
                    .catch(err => {
                        console.log(err);
                        errors.push("Erreur technique : oups :s ");
                        res.render('register');
                        //res.status(400).send('adding new todo failed');
                    });
            }else {
                errors.push("Login existe déjà");
                res.render('register', {'errors': errors});
            }
        });
    });

    userRoutes.route('/login').get(function(req, res) {
        res.render('login');
    })
    userRoutes.route('/login').post(function(req, res) {
        // On prends le login et on lke cherche en base de données
        User.find({ login: req.body.login }, function(err, users) {
            // users liste des users qui match (normalement qu'un seul)
            if(users.length ==0){
                res.render('login',  { 'errors' : "mot de passe ou login incorrect" });
                //On s'arret ici pour ne pas faire le test sur le premier user
                // on on met un else (aussi fait)
                return;
            } else {
                // On prend le premier
                user = users[0];
                // On compare le mot de passe hashé en base avec un hash de ce qu'on vient de nous fournit.
                if (user.password == toSha1(req.body.password)) {
                    // On est connecté
                    console.log("ouppiii");
                    // mémorise l'utilisateur dans la session (qui est gardé entre les pages)
                    req.session.user = user;
                    res.redirect('/welcome');
                } else {
                    console.log("oups");
                    res.render('login', {'errors': "mot de passe ou login incorrect"});
                }
            }
        });
        //res.render('login');
    });
    app.use(userRoutes);

    userRoutes.route('/welcome').get(function(req, res) {
        let userCourent = req.session.user;
        if(userCourent){
            res.render('welcome', {login: userCourent.login, email :userCourent.email});
        }else{
            res.redirect('/login');
        }

    })

    var server = app.listen(portServer, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Example app listening at http://%s:%s", host, port)
    })
    //db.close();
});

function toSha1(password){
    // On crée notre Hasher avec l'algo qu'on veux
    var shasum = crypto.createHash('sha1');
    // ce qu'on veux hasher
    shasum.update(password);
    // hex => Format de retour hex 012345679abcdef (base 16)
    return shasum.digest('hex');
}