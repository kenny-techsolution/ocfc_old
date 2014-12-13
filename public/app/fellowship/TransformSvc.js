//6.30.2014 include service for post type
angular.module('app').factory('TransformSvc', function () {
	// rest api standard, for GET, if id is specified, it will grab specific
	// user by id
	var toPostTypeInt = function (type) {
		if (type === 'testimony') {
			return 0;
		} else if (type === 'question') {
			return 1;
		} else if (type === 'general') {
			return 2;
		} else if (type === 'event') {
			return 3;
		} else {
		}
	};

	var postTypeInt = [
		'Testimony',
		'Question',
		'General',
		'Event'
	];

	var toPostTypeStr = function (type) {
		return postTypeInt[type];
	};

	return {
		toPostTypeInt: toPostTypeInt,
		toPostTypeStr: toPostTypeStr
	};

});