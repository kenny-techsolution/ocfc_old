/*************************************************************************************
 11.18.2014 re-create Album model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var wallSchema = mongoose.Schema({
	type:			{type: String, Required:'(type) is required!', index: true, unique: false,lowercase: true},
	fellowshipId:	{type: ObjectId, ref:'Fellowship', index: true, unique: true,lowercase: true},
	churchId:		{type: ObjectId, ref:'Church', index: true, unique: false,lowercase: true}
});

var Wall = mongoose.model('Wall', wallSchema);