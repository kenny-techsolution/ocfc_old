/*************************************************************************************
 5.24.2014, create creatPost object that grabs data from mongodb by zipcode
 ***************************************************************************************/

var Event = require('mongoose').model('Event'),
	commFunc = require('../utilities/commonFunctions');

//POST
exports.createEvent = function (req, res, next) {
	var eventData = req.body;
	eventData.postBy = req.user._id;

	if (eventData.type == 3) {
		Event.create(eventData, function (err, returnedEvent) {
			console.log('chk returnedEvent');
			console.log(returnedEvent);
			res.send(returnedEvent);
		});
	}
};
