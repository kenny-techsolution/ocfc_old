/**
 * Created by haojenchung on 11/4/14.
 */
angular.module('app').directive('ocfcPostTestimony', function () {
	return{
		restrict: 'E',
		$scope: {
			post: "="
		},
		templateUrl: '/partials/fellowship/wall/ocfc-post-testimony',
		controller: function ($scope) {

		}
	};
});