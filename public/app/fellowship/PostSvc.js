/*******************************************************************************
 * This file creates a new Controller called PostSvc creates a resource
 * called fellowMemResource fellowMemResource: Takes rest /api/fellowMems/:id
 * using GET method to grab records for specific user
 ******************************************************************************/

// factory, is a singleton, that contains data or function that can be used
// across controllers
angular.module('app').factory('PostSvc', function ($resource) {
	// rest api standard, for GET, if id is specified, it will grab specific
	// user by id
	var postResource = $resource('/api/posts/:_id', {
		_id: '@id'
	}, {
		'update': {
			method: 'PUT',
			isArray: false
		}
	});
	return postResource;
});