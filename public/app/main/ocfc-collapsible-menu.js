/**
 * Created by haojenchung on 6/23/14.
 */
angular.module('app').directive('ocfcCollapsibleMenu', function () {
	return{
		restrict: 'E',
		templateUrl: '/partials/main/ocfc-collapsible-menu',
		$scope: {
			fellowship: "=fellowshipData"
		},
		controller: function ($scope) {
			$scope.open = false;
			$scope.toggleMenu = function () {
				$scope.open = !$scope.open;
			}
		}
	};
});