'use strict';

exports.post = function(req, res, next) {
    console.log('-> LOGOUT OCCURRED!');
    var sid = req.session.id;

    var io = req.app.get('io');
    var socketsEmitter = require('../socketsEmitter')(io);

    req.session.destroy(function (err) {
        // console.log(io);
        // io.emit('disconnect', sid);
        //io.emit('session:reload', sid);
        socketsEmitter.emit('io:session:reload', sid);
        if (err) return next(err);
        res.redirect('/');
    });
};