/*************************************************************************************
11.18.2014 Re-create Fellow model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var commentSchema=require('./Comment').commentSchema;
/*EVENT Specific*/
var eventSchema = mongoose.Schema({
	albumId:		{type: ObjectId, ref:'Album',index: false, unique: false},
	comments:		[commentSchema],
	links:			[{type: String, index: false, unique: false}],
	title:			{type: String, Required:'(title) is required!',index: false, unique: false},
	description:	{type: String, Required:'(description) is required!',index: false, unique: false},
	fromDate:		{type: Date, Required:'(fromDate) is required!',index: false, unique: false},
	toDate:			{type: Date, Required:'(toDate) is required!',index: false, unique: false},
	where:			{type: String, Required:'(where) is required!',index: false, unique: false},
	hostBy:			{type: ObjectId, ref:'User', Required:'(hostBy) is required!',index: false, unique: false},
	banner:			{type: String, index: false, unique: false},
	invitees:		[{type: ObjectId,ref:'User'}],
	gos:			[{type: ObjectId,ref:'User'}],
	noGos:			[{type: ObjectId,ref:'User'}],
	maybes:			[{type: ObjectId,ref:'User'}]
});

var Event = mongoose.model('Event', eventSchema);
