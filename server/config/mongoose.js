var mongoose = require('mongoose'),
	userModel = require('../models/User'),//4.30.2014, added new model for members who joined a fellowship
	userModel= require('../models/User'),
	fellowModel = require('../models/Fellowship'),
	churchModel = require('../models/Church'),
	fellowUserModel = require('../models/FellowshipUser'),
	churchFellowModel= require('../models/ChurchFellowship'),
	churchUserModel= require('../models/ChurchUser'),
	postModel = require('../models/Post'),
	eventModel = require('../models/Event'),
	commentModel= require('../models/Comment'),
	albumModel= require('../models/Album'),
	calendarModel= require('../models/Calendar'),
	folderModel= require('../models/Folder'),
	fileModel= require('../models/File'),
	imageModel= require('../models/Image'),
	inviteOtherToFellowshipModel= require('../models/InviteOtherToFellowship'),
	membershipModel = require('../models/Membership');

module.exports = function (config) {
	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error....'));
	db.once('open', function callback() {
		console.log('ocfc db opened');
	});
	//used for creating dummy data
//	userModel.createDefaultUsers();
//	fellowModel.createDefaultFellowships();
//	churchModel.createDefaultChurches();
//	churchFellowModel.createDefaultChurchFellows();
//	churchUserModel.createDefaultChurchUsers();
};

