'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);
var mongoose = require('libs/mongoose');
var HttpError = require('error').HttpError;

//var routes = require('./routes');
//var user = require('./routes/user');

var app = express();
app.set('port', config.get('port'));

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});

// Middleware

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));

// app.use(express.logger('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.bodyParser());

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var sessionStore = require('./libs/sessionStore');
var expressSession = require('express-session');
app.use(expressSession({
    secret: config.get('session:secret'),
    key: 'sid',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: null
    },
    store: sessionStore
}));

app.use(require('middleware/sendHttpError'));

app.use(require('middleware/loadUser'));

// app.use(app.router);
var checkAuth = require('middleware/CheckAuth');
app.get('/', require('./routes/frontpage').get);
app.get('/login', require('./routes/login').get);
app.post('/login', require('./routes/login').post);
app.post('/logout', require('./routes/logout').post);
app.get('/chat', checkAuth, require('./routes/chat').get);

require('routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {
    if (typeof err === 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') === 'development') {
            var errorHandler = express.errorHandler();
            errorHandler(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

var io = require('./socket')(server);
app.set('io', io);
