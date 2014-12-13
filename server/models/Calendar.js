/*************************************************************************************
11.18.2014 re-create Calendar model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var calendarSchema = mongoose.Schema({
	ownerType:		{type: String, Required:'(ownerType) is required!', index: true, unique: false},
	fellowshipId:	{type: ObjectId, ref:'Fellowship', Required:'(fellowshipId) is required!', index: true, unique: false},
	churchId:		{type: ObjectId, ref:'Church', Required:'(churchId) is required!', index: true, unique: false},
	eventIds:		[{type: ObjectId, ref:'Event', Required:'(eventId) is required!', index: true, unique: false}],
	title:			{type: String, Required:'(title) is required!', index: true, unique: false},
	createdOn:		{type: Date, Required:'(createdOn) is required!', index: true, unique: false,default:Date.now},
	updatedOn:		{type: Date, Required:'(updatedOn) is required!', index: true, unique: false,default:Date.now},
	createdBy:		{type: ObjectId, ref:'User', Required:'(createdBy) is required!', index: true, unique: false}
});

var Calendar = mongoose.model('Calendar', calendarSchema);

