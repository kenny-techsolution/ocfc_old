/*************************************************************************************
 This file creates a new Directive called ProfileCtrl
 which injects $scope, AuthSvc.js,IdentitySvc.js,NotifierSvc.js

 Includes 4 fields: email, fname, lname and password (optional)

 Script will update email, fname & lname, if password is entered then save the new info.

 Calls AuthSvc.updateCurrentUser with the new data stored in object, newUserData.
 ***************************************************************************************/

angular.module('app').controller('ProfileCtrl', function ($scope, AuthSvc, IdentitySvc, NotifierSvc) {
	$scope.email = IdentitySvc.currentUser.userName;
	$scope.fname = IdentitySvc.currentUser.firstName;
	$scope.lname = IdentitySvc.currentUser.lastName;

	$scope.update = function () {
		console.log("update function completed");
		var newUserData = {
			userName: $scope.email,
			firstName: $scope.fname,
			lastName: $scope.lname
		};
		if ($scope.password && $scope.password.length > 0) {
			newUserData.password = $scope.password;
		}

		AuthSvc.updateCurrentUser(newUserData).then(function () {
				NotifierSvc.notify('Your user account has been updated');
			}
			, function (reason) {
				NotifierSvc.error(reason);
			});
	};

	// As of 11.8.2014, $scope.signin function is not being called elsewhere
	// $scope.signin is a function that calls AuthSvc.authenticateUser(username, password) to sign in
	// AuthSvc.authenticateUser updates data by calling $http post service
	// Also adding response data with extend method
	$scope.signin = function (username, password) {
		AuthSvc.authenticateUser(username, password).then(function (success) {
			if (success) {
				NotifierSvc.notify('You have successfully signed in!');
			} else {
				NotifierSvc.notify('Username/Password combination incorrect');
			}
		});
	};

});