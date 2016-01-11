'use strict';

exports.post = function(req, res) {
    console.log('-> LOGOUT OCCURRED!');
    req.session.destroy();
    res.redirect('/');
};