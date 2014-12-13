//Bring in express module to start creating express app
var express = require('express'),
//Bring in CSS, stylus to work with express
	stylus = require('stylus'),
	passport = require('passport');

module.exports = function (app, config) {
	//Compiler gets used by the middleware
	function compile(str, path) {
		return stylus(str).set('filename', path);
	}

	//Configure express
	app.set('views', config.rootPath + '/server/views');
	app.set('view engine', 'jade');

	//Turn on express logging & logging parser
	app.use(express.logger('dev'));

	//add cookie parser for sessions
	app.use(express.cookieParser());
	//app.use(express.bodyParser());
	//upload image
	app.use(express.bodyParser({uploadDir: config.rootPath + '/uploads'}));

	//add session middle ware
	app.use(express.session({secret: 'multi vision unicorns'}));
	//initialize passport
	app.use(passport.initialize());
	app.use(passport.session({
		maxAge: new Date(Date.now() + 3600000), //1 Hour
		expires: new Date(Date.now() + 3600000), //1 Hour
	}));
	//Configure stylus middleware
	app.use(stylus.middleware(
		{
			src: config.rootPath + '/public',
			compile: compile
		}
	));

	//Static routing to public directory
	app.use(express.static(config.rootPath + '/public'));

};