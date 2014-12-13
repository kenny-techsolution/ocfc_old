/*************************************************************************************
 11.18.2014 re-create Folder model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var folderSchema = mongoose.Schema({
	name:		{type: String, index: true, unique: false},
	createdBy:	 {type: ObjectId, ref:'User', Required:'(createdBy) is required!',index: true, unique: false},
	createdOn:	{type: Date, Required:'(createdOn) is required!', index: true, unique: false, default:Date.now},
	fileIds:	[{type: ObjectId, ref:'File', index: true, unique: false}],
	description: {type: String, index: true, unique: false},
	updatedOn:	{type: Date, Required:'(updatedOn) is required!', index: true, unique: false, default:Date.now}
});

var Folder = mongoose.model('Folder', folderSchema);
