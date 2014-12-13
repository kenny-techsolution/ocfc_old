/*************************************************************************************
 This file creates a new directive
 which injects the following: $scope, $http, IdentitySvc.js, NotifierSvc.js and AuthSvc.js


 There are 2 objects created (identity and signin)
 identity: Assigned from IdentitySvc service which holds currentUser and isAuthenticated
 objects.

 signin:  Takes username and password as parameters to authenticate user
 using authenticateUser of AuthSvc service
 ***************************************************************************************/
//6.22.2014, create directive for signin
angular.module('app').directive('ocfcSignin', function () {
	return{
		restrict: 'E',
		scope: {},
		templateUrl: '/partials/account/access/ocfc-signin',
		controller: function ($scope, $http, IdentitySvc, NotifierSvc, AuthSvc) {
			$scope.identity = IdentitySvc;
			$scope.signin = function (username, password) {
				// AuthSvc.authenticateUser updates data by calling $http post service
				// Also adding response data with extend method
				AuthSvc.authenticateUser(username, password).then(function (success) {
					if (success) {

						NotifierSvc.notify('You have successfully signed in!');

					} else {
						NotifierSvc.notify('Username/Password combination incorrect');
					}
				});
			}
		}
	};
});