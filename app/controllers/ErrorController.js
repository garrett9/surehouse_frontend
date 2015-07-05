/**
 * A simple error controller.
 */
app.controller('ErrorController', function($scope, $timeout) {
	$scope.animate = false;
	$timeout(function() {
		$scope.animate = true;
	}, 2000);
});