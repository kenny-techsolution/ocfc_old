/*******************************************************************************
 * This file creates a new Controller called FellowMemSvc creates a resource
 * called fellowMemResource fellowMemResource: Takes rest /api/fellowMems/:id
 * using GET method to grab records for specific user
 ******************************************************************************/

// factory, is a singleton, that contains data or function that can be used
// across controllers
angular.module('app').factory('FellowshipSvc', function ($resource, $http) {
	// rest api standard, for GET, if id is specified, it will grab specific
	// user by id
	var fellowshipResource = $resource('/api/fellows/:_id', {
		_id: '@id'
	}, {
		'update': {
			method: 'PUT',
			isArray: false
		}
	});

	//params can be any type of parameter such as zipcode and more..
	//params will merge w below objects using extend method
	fellowshipResource.getFellows = function (params) {
		var params = $.extend({
			url: '/api/fellows',
			method: 'GET'
		}, params);

		return $http(params);
	};

	return fellowshipResource;
});