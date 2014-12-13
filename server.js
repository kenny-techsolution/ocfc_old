//Bring in express module to start creating express app
//Built on to of Node Js
//Create actual express app
//app is defined as server
var app = require('express')(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

//Set environment mode
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/config')[env];
server.listen(config.port);

require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/passport')();
require('./server/config/routes')(app, io);

console.log('Listening on port' + config.port + '...');