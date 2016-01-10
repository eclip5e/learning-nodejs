'use strict';

module.exports = function (req, res, next) {

    console.log(res);

    res.sendHttpError = function (error) {

        res.statusCode = error.status;
        if (res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json(error);
        } else {
            res.render('error', {error: error});
        }

    };

    next();

};