// BASE SETUP
// =============================================================================

var express = require('express');
var app = express();
var port = 10001;

var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var jwt = require('express-jwt');
var morgan  = require('morgan');
var tokenManager = require('./config/token_manager');
var secret = require('./config/secret');


var routes = {};
routes.users = require('./routes/users');
routes.projects = require('./routes/projects');
routes.index = require('./routes/index');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DATABASE
// =============================================================================

mongoose.connect("mongodb://localhost:27017/testNode");

// ROUTES FOR OUR API
// =============================================================================

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

router.get('/', routes.index.index);

// ROUTES PROJECTS
// =============================================================================

/*
router.post('/projects', jwt({secret: secret.secretToken}), routes.projects.add);
router.get('/projects', jwt({secret: secret.secretToken}), routes.projects.list);
router.get('/projects/:id', jwt({secret: secret.secretToken}), routes.projects.one);
router.delete('/projects/:id', jwt({secret: secret.secretToken}), routes.projects.delete);
router.put('/projects/:id', jwt({secret: secret.secretToken}), routes.projects.update);
*/


// ROUTES USERS
// =============================================================================

router.post('/users', routes.users.add);
router.get('/users', jwt({secret: secret.secretToken}), routes.users.list);
router.get('/users/:id', routes.users.one);
router.delete('/users/:id', routes.users.delete);
router.put('/users/:id', routes.users.update);

router.put('/users/:id/notifications', routes.users.addNotification);
router.delete('/users/:userId/notifications/:notificationId', routes.users.deleteNotification);

// ROUTES AUTH
// =============================================================================

router.post('/user/register', routes.users.register);
router.post('/user/login', routes.users.login);
router.get('/user/logout', jwt({secret: secret.secretToken}), routes.users.logout);

// START THE SERVER
// =============================================================================
app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);