/*************************************************************************************
This file creates a new mongoose model called User

The userSchema has 2 methods:
authenticate:  injects passwordToMatch to validate against encrypted password.
hasRole:  injects role to check if role value exist

11.18.2014, re-create User model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose'),
	encrypt = require('../utilities/encryption'),
	ObjectId = mongoose.Schema.Types.ObjectId;

var membershipSchema = mongoose.Schema({
	userId:			{type: ObjectId, ref:'User', required:'(userId) is required!',index: true, unique: false},
	fellowships:	[{
		fellowshipId : 	{type: ObjectId, ref:'Fellowship', required:'(FellowshipId) is required!', index: false, unique: false},
		name:			{type: String, required:'(name) is required!', index: true, unique: false,lowercase: true},
		role:	 		{type: String, required:'(role) is required!', index: false, unique: false,lowercase: true}
	}],
	churches:	[{
		churchId: 		{type: ObjectId, ref:'Church', required:'(churchId) is required!', index: false, unique: false},
		name:			{type: String, required:'(name) is required!', index: true, unique: false,lowercase: true},
		role:	 		{type: String, required:'(name) is required!', index: false, unique: false,lowercase: true}
	}],
	albums: [{
		albumId:  		{type: ObjectId, ref:'Album',  required:'(albumId) is required!', index: false, unique: false},
		name:			{type: String, required:'(name) is required!', index: true, unique: false,lowercase: true}
	}]
});

membershipSchema.methods = {

};

var Membership = mongoose.model('Membership', membershipSchema);
//Create pre-populated or default dummy data
