/*************************************************************************************
 This file creates a new Directive called ProfileCtrl
 which injects $scope, AuthSvc,IdentitySvc,NotifierSvc

 Controller contains $scope.update function which sets userName, firstName, lastName
 and password.  Data gets updated into AuthSvc service if data entry of password in the
 frontend is not empty.
 ***************************************************************************************/

//6.22.2014, create directive for profile-form
angular.module('app').directive('ocfcProfileForm', function () {
	return{
		restrict: 'E',
		templateUrl: '/partials/account/profile/ocfc-profile-form',
		controller: function ($scope, AuthSvc, IdentitySvc, NotifierSvc) {
			$scope.email = IdentitySvc.currentUser.userName;
			$scope.fname = IdentitySvc.currentUser.firstName;
			$scope.lname = IdentitySvc.currentUser.lastName;

			$scope.update = function () {
				var newUserData = {
					userName: $scope.email,
					firstName: $scope.fname,
					lastName: $scope.lname
				}
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
		}
	};
});