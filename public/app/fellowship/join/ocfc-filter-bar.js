//6.23.2014, create directive for filter bar
angular.module('app').directive('ocfcFilterBar', function () {
	return{
		restrict: 'E',
		$scope: true,
		templateUrl: '/partials/fellowship/join/ocfc-filter-bar',
		controller: 'JoinFellowCtrl'
	};
});