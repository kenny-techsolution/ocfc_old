/*************************************************************************************
 11.18.2014 Re-create InviteUserToFellowship model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var inviteOtherToFellowshipSchema = mongoose.Schema({
	fellowshipId: {type: ObjectId, ref:'Fellowship', Required:'(fellowshipId) is required!', index: false, unique: false,lowercase: true},
	inviter: {type: ObjectId, ref:'User', Required:'(userId) is required!',index: true, unique: false,lowercase: true},
	invitee: {type:String,index: false, unique: false,lowercase: true},
	email: {type:String,index: false, unique: false,lowercase: true},
	welcomeMessage: {type:String,index: false, unique: false,lowercase: true},
	invitedOn:	{type: Date, Required:'(date) is required!', index: true, unique: false,lowercase: true, default: Date.now}
});

var InviteOtherToFellowship = mongoose.model('InviteOtherToFellowship', inviteOtherToFellowshipSchema);
