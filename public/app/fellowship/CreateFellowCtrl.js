/*******************************************************************************
 5.7.2014, This controller is used to create new fellowship(s) by Administrator
 ******************************************************************************/
angular.module('app').controller('CreateFellowCtrl', function ($scope, $http, FellowshipSvc, NotifierSvc) {

	// this function will interact with the server to let user create a
	// new fellowship.
	$scope.cfForm = {
		zipcode: '',
		fellowName: '',
		url: '',
		phone: '',
		address: '',
		proof: '',
		description: ''
	};

	//5.15.2014 Add code to display fellowship list created by Admin user
	$scope.createFellowship = function () {
		var createFellowForm = $scope.cfForm;
		var fellowship = {};

		//need to find a way to validate zipcode for correctness too
		fellowship.zipcode = createFellowForm.zipcode;
		fellowship.status = "Waiting for Approval";
		fellowship.fellowName = createFellowForm.fellowName;
		fellowship.url = createFellowForm.url;
		fellowship.address = createFellowForm.address;
		fellowship.description = createFellowForm.description;

		var newFellow = new FellowshipSvc(fellowship);
		newFellow.$save().then(function () {
				NotifierSvc.notify('New fellowship has been created, please wait for approval');
			}, function (reason) {
				NotifierSvc.error(reason);
			}
		);
	};

	// 5.15.2014
	// this function will reset zipcode and fellowName to blank
	// fellowship when under Pending status
	$scope.resetCreateFellowship = function () {
		$scope.cfForm.zipcode = '';
		$scope.cfForm.fellowName = '';
		$scope.cfForm.url = '';
		$scope.cfForm.phone = '';
		$scope.cfForm.address = '';
		$scope.cfForm.proof = '';
		$scope.cfForm.description = '';
		$scope.myFormNg.$setPristine();
	};

});