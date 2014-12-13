var FellowUser = require('mongoose').model('FellowshipUser');

//Grab all fellowship data associated to a user
exports.getInit = function (req, res) {
	var userId = req.query.userId;

	console.log("getFellowMemByUser");
	console.log(userId);


	FellowUser.find({userId: userId, status: 'Approved'}).populate('fellowship').exec(function (err, collection) {
		var fellows = [];
		console.log("test init.js");
		console.log(collection);

		for (var i in collection) {
			console.log("fellows");
			console.log(collection[i]);
			fellows.push(collection[i].fellowship);
		}
		console.log(fellows);
		//create an object for fellows array to be easily consumed
		//var is a local variable which is private and cannot be access outside of this function
		var initObj = {
			myFellowships: fellows
		};
		res.send(initObj);
	});
};




