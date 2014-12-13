/*************************************************************************************
11.18.2014 Create Fellow model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
//11.6.2014 Testimony Model
exports.commentSchema = mongoose.Schema({
	userId:		{type: ObjectId, ref:'User', Required:'(userId) is required!', sparse:true},
	comment:	{type: String, Required:'(comment) is required!',index: false, unique: false,lowercase: true},
	profileImg: {type: String, index: false, unique: false,lowercase: true},
	firstName:	{type: String, Required:'(firstName) is required!',index: false, unique: false,lowercase: true},
	lastName:	{type: String, Required:'(lastName) is required!',index: false, unique: false,lowercase: true},
	createdOn:	{type: Date,index: false, unique: false, default: Date.now},
	updatedOn:	{type: Date,index: false, unique: false, default: Date.now}
});