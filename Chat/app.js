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

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());

//app.use(express.bodyParser());

app.use(express.cookieParser());

var MongoStore = require('connect-mongo')(express);

app.use(express.session({
    secret: 'IKnowWhatYouDidThere',
    key: 'sid',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: null
    },
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(require('middleware/sendHttpError'));

app.use(require('middleware/loadUser'));

app.use(app.router);

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

require('./socket')(server);