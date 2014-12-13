/*************************************************************************************
This file creates a new mongoose model called User

The userSchema has 2 methods:
authenticate:  injects passwordToMatch to validate against encrypted password.
hasRole:  injects role to check if role value exist

11.18.2014, re-create User model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose'),
	encrypt = require('../utilities/encryption');

//add hometown. seeker and christian
//combine firstname and lastname to fullname
var userSchema = mongoose.Schema({
	firstName: 	{type: String, required: '(firstName) is required!', index: true, unique: false,lowercase: true},
	lastName: 	{type: String, required: '(lastName) is required!', index: true, unique: false,lowercase: true},
	userName: 	{type: String, required: '(userName uses email) is required!', index: true, unique: true,lowercase: true},
	hashedPwd: 	{type: String, required: '(hashedPwd) is required!',index: true, unique: false,lowercase: true, select: false},
	salt: 		{type: String, required: '(salt) is required!',index: true, unique: true, select: false},
	birthday:	{type: Date,index: true, unique: false,lowercase: true},
	gender: 	{type: String, index: false, unique: false,lowercase: true},
	profileImg: {type: String, index: false, unique: false},
	signupDate: {type: Date,required:'(signupDate) is required!',index: true, unique: false,lowercase: true,default: Date.now},
	about:		{type: String, index: false, unique: false,lowercase: true},
	place: 		{type: String, unique: false,lowercase: true},
	coordinates:[{type: Number,index: true, unique: false,lowercase: true}],
	language: 	{type: String, required:'(language) is required!', index: true, unique: false,lowercase: true},
	passReset:	{type: String, index: false, unique: false,lowercase: true, select: false},
	resetOn:	{type: Date,index: false, unique: false,lowercase: true, select: false,default: Date.now},
	active:     {type: Boolean,index: false, unique: false, select: false,default:true}
});

userSchema.methods = {
	authenticate: function (passwordToMatch) {
		//salt and passwordToMatch parameter are used to create hashPwd
		console.log("console.log(passwordToMatch);");
		console.log(passwordToMatch);
		console.log(this);
		console.log(encrypt.hashPwd(this.salt, passwordToMatch));
		console.log(this.hashedPwd);
		return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashedPwd;
	},
	hasRole: function (role) {
		return this.userRoles.indexof(role) > -1;
	}

};

var User = mongoose.model('User', userSchema);
//Create pre-populated or default dummy data
function createDefaultUsers() {
	User.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			var salt, hash;
			//new salt is created each time thus, user will have it's own unique value
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'joe');
			User.create({firstName: 'Joe', lastName: 'Eames', userName: 'joe@gmail.com', salt: salt, hashedPwd: hash,
						signupDate:'01/01/2014',place:'San Francisco',geoCode:[-34.397, 150.644],language:'English'});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'mei');
			User.create({firstName: 'Mei', lastName: 'Zhang', userName: 'mei@gmail.com', salt: salt, hashedPwd: hash,
						signupDate:'02/01/2014',place:'Los Angeles',geoCode:[-30.397, 130.644],language:'English'});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'kenny');
			User.create({firstName: 'Kenny', lastName: 'Chung', userName: 'kenny@gmail.com', salt: salt, hashedPwd: hash,
						signupDate:'03/01/2014',place:'Millbrae',geoCode:[-20.397, 120.644],language:'Mandarin'});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'ting');
			User.create({firstName: 'Ting', lastName: 'Chung', userName: 'ting@gmail.com', salt: salt, hashedPwd: hash,
						signupDate:'02/01/2014',place:'Taiwan',geoCode:[-10.397, 110.644],language:'Mandarin'});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'john');
			User.create({firstName: 'John', lastName: 'Doe', userName: 'john@gmail.com', salt: salt, hashedPwd: hash,
						signupDate:'03/01/2014',place:'Ohio',geoCode:[-13.397, 160.644],language:'English'});
		}
	})
};

exports.createDefaultUsers = createDefaultUsers;
