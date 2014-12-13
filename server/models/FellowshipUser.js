/*************************************************************************************
 11.18.2014 re-create User model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//mongoose.Schema.Types.ObjectId
var fellowshipUserSchema = mongoose.Schema({
	userId:			{type: ObjectId, ref:'User', required:'(userId) is required!',index: false, unique: false,lowercase: true},
	fellowshipId:	{type: ObjectId, ref:'Fellowship',required:'(fellowshipId) is required!', index: false, unique: false,lowercase: true},
	signupDate:		{type: String,required:'(signupDate) is required!',index: false, unique: false,lowercase: true,default: Date.now},
	status:			{type: String, required:'(status) is required!', index: false, unique: false,lowercase: true},
	role:			{type: String, required:'(role) is required!', index: false, unique: false,lowercase: true},
	rejectReason:	{type: String,index: false, unique: false,lowercase: true},
	updateDate:		{type: Date, required:'(updateDate) is required!', index: false, unique: false,lowercase: true,default: Date.now}
});

var FellowshipUser = mongoose.model('FellowshipUser', fellowshipUserSchema);
