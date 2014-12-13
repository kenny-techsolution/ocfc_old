/*************************************************************************************
 This file creates a new Directive called IdentitySvc
 which injects $window and UserSvc.js
 UserSvc.js: look up records containing 'admin' on Mongo db

 Object currentUser is created, if records exist then the code will extend to
 currentUser.jade
 currentUser.jade: converts db record into JSON format

 currentUser, isAuthenticated and isAuthorized values will be returned

 currentUser: equals UserSvc() function in UserSvc.js
 isAuthenticated: returns currentUser info
 isAuthorized: returns currentUser and checks for 'admin' role access

 factory or service are used as single copy known as singleton
 factory returns objects
 ***************************************************************************************/
angular.module('app').factory('IdentitySvc', function ($window, UserSvc) {
	var currentUser;
	if (!!$window.bootstrappedUserObject) {
		currentUser = new UserSvc();
		angular.extend(currentUser, $window.bootstrappedUserObject);
	}
	return{
		currentUser: currentUser,
		isAuthenticated: function () {
			return !!this.currentUser;

		},
		isAuthorized: function (role) {
			return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;

		}
	}
});