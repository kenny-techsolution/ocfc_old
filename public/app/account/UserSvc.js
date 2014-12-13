/*************************************************************************************
 This file creates a new Directive called UserSvc
 which takes in $resource directive

 Object UserResource is created which check Mongodb records for 'admin'

 4.29.2014, added new code to check for churchAdmin and worldAdmin against Mongodb
 ***************************************************************************************/

angular.module('app').factory('UserSvc', function ($resource) {
	//rest api standard, for GET, if id is specified, it will grab specific user by id
	var UserResource = $resource('/api/users/:id', {_id: "@id"}, {
		update: {method: 'PUT', isArray: false}
	});

	UserResource.prototype.isAdmin = function () {
		//check role column to check if 'admin' value exist
		return this.roles && this.roles.indexOf('admin') > -1;
		console.log("test this.roles && this.roles.indexOf('admin')>-1");
		console.log(this.roles);
		console.log(this.roles.indexOf('admin'));
	}
	return UserResource;
});

