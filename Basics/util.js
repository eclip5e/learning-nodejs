var util = require('util');

// Method: .inspect()

var obj = {
    inspect: function () {
        return 'Using overridden inspect method.';
    },
    x: 5,
    y: 'Some text'
};

obj.self = obj;

console.log( util.inspect(obj) );

// Method: .format()

var str = util.format('That\'s what we\'ve got: %s - %d - %j', 'STRING', 99, {testProperty: 'Test Value'});
console.log(str);

// Method: .inherits()

function Vehicle(name) {
    this.name = name;
}

Vehicle.prototype.roll = function () {
    console.log(this.name + ' rolls!');
};

function Plane(name) {
    this.name = name;
}

Plane.prototype.fly = function () {
    console.log(this.name + ' flies!');
};

util.inherits(Plane, Vehicle);

var airbus = new Plane('Airbus A380');
airbus.roll();
airbus.fly();