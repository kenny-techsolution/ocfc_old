//7.5.2014, create directive that toggles button
angular.module('app').directive('ocfcToggleButton', function () {
	return{
		restrict: 'E',
		scope: {
			status: "="
		},
		templateUrl: '/partials/common/ocfc-toggle-button',
		controller: function ($scope) {
		}
	};
});