/*******************************************************************************
 * This file creates a new Controller called FellowUsersSvc creates a resource
 * called fellowUsersResource fellowMemResource: Takes rest /api/fellowUsers/:id
 * using GET method to grab records for specific user
 ******************************************************************************/

// factory, is a singleton, that contains data or function that can be used
// across controllers
angular.module('app').factory('FellowUserSvc', function ($resource) {
	// rest api standard, for GET, if id is specified, it will grab specific
	// user by id
	var fellowUserResource = $resource('/api/fellowUsers/:_id', {
		_id: '@id'
	}, {
		'update': {
			method: 'PUT',
			isArray: false
		},
		'delete_fellowUsers': {
			method: 'DELETE',
			params: {}
		}
	});

	return fellowUserResource;
});