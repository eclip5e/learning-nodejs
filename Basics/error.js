var util = require('util');

var bar = {
    "Whiskey": "Виски",
    "Cola": "Кола"
};

function BarError(message) {
    this.message = message;
    Error.captureStackTrace(this, BarError);
}
util.inherits(BarError, Error);
BarError.prototype.name = 'BarError';

function BartenderError(status, message) {
    this.status = status;
    this.message = message;
    Error.captureStackTrace(this, BartenderError);
}
util.inherits(BartenderError, Error);
BartenderError.prototype.name = 'BartenderError';

function getDrink(drink) {
    if (!bar[drink]) {
        throw new BarError(drink + ' - There is no such a drink in the bar!');
    }
    return bar[drink];
}

function makeCoctail(clientIsDrunk) {
    if (clientIsDrunk) {
        throw new BartenderError('404: Client too drunk.', 'Enough drinking for today! Go home and rest!');
    }
    return util.format('Here is your %s and %s!', getDrink('Whiske'), getDrink('Cola'));
}

try {
    var order = makeCoctail(false);
    console.log(order);
} catch (e) {

    if (e instanceof BartenderError) {
        console.log(e.status, e.message);
    } else {
        console.log(' ERROR: %s\n MESSAGE: %s\n STACK: %s', e.name, e.message, e.stack);
    }

}