var userFactory = require('./user');

var kolya = new userFactory.User('Kolya');
var borya = new userFactory.User('Borya');

kolya.greet();
