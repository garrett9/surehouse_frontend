/**
 * The AlertsSubscriptionsController handles anything dealing with alert subscriptions, such as creating, editing, or deleting them.
 */
app.controller('AlertSubscriptionsController', function($scope, $location, $timeout, $routeParams, AlertSubscription) {

	$scope.subscriptions = [];
	
	$scope.checked = [];
	
	/**
	 * Retrieve all alerts, including whether or not the current user subscribed to them.
	 */
	$scope.all = function() {
		AlertSubscription.all(function(res) {
			$scope.subscriptions = res.payload;
			for(var sub in $scope.subscriptions) {
				if($scope.subscriptions[sub].subscribed == true)
					$scope.checked.push($scope.subscriptions[sub].id);
			}
		});
	}
	
	/**
	 * Subscribe to multiple alerts at a time.
	 */
	$scope.subscribeToMultiple = function() {
		AlertSubscription.subscribeToMultiple({"checked[]": $scope.checked}, function(res, status) {
			$scope.subscription_success = 'Successfully saved your changes.';
			console.log($scope.subscription_success);
		});
	}
	
});