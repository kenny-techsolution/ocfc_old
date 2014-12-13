var path = require('path');
//means to go twice up the root of directory name location
var rootPath = path.normalize(__dirname + '/../../');

//6.17.2014 updated port 3030 to 80
module.exports={
	development:{
		db:  'mongodb://104.8.6.58/ocfc',//104.8.6.58
		rootPath: rootPath,
		port: process.env.PORT || 3030,
		uploadPath: rootPath + '/uploads'
	},
	production:{
		db:  'mongodb://192.168.1.71/ocfc',
		rootPath: rootPath,
		port: process.env.PORT || 80,
		uploadPath: rootPath + '/uploads'
	}
};