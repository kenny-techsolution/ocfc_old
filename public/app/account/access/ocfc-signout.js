/*************************************************************************************
 This file creates a new directive
 which injects $scope,NotifierSvc,IdentitySvc,AuthSvc,$location directives

 There are 2 objects created (identity and signout)

 identity: Assigned from IdentitySvc service which hold for currentUser and isAuthenticated
 objects.
 signout:  Function that calls logoutUser object of AuthSvc service, then
 sets username and password to null.
 ***************************************************************************************/

//6.22.2014, create directive for signout
angular.module('app').directive('ocfcSignout', function () {
	return{
		restrict: 'E',
		scope: {},
		templateUrl: '/partials/account/access/ocfc-signout',
		controller: function ($scope, NotifierSvc, IdentitySvc, AuthSvc, $location) {
			//login box did not disappear
			$scope.identity = IdentitySvc;
			$scope.signout = function () {
				AuthSvc.logoutUser().then(function () {
					$scope.username = "";
					$scope.password = "";
					NotifierSvc.notify('You have successfully signed out!');
					$location.path('/');
				});
			}
		}
	};
});