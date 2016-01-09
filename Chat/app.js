'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);

//var routes = require('./routes');
//var user = require('./routes/user');

var app = express();
app.set('port', config.get('port'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

http.createServer(app).listen(app.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});

// Middleware

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);

app.get('/', function(req, res, next) {
    res.render('index', {
        body: '<b>Hello!</b>'
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {
    if (app.get('env') === 'development') {
        var errorHandler = express.errorHandler();
        errorHandler(err, req, res, next);
    } else {
        res.send(500);
    }
});

//app.get('/', routes.index);
//app.get('/users', user.list);
