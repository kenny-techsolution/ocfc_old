//6.23.2014, create directive for filter bar
angular.module('app').directive('ocfcFellowList', function () {
	return{
		restrict: 'E',
		templateUrl: '/partials/fellowship/join/ocfc-fellow-list',
		$scope: true,
		controller: 'JoinFellowCtrl'
	};
});