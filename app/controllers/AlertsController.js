/**
 * The AlertsController handles anything dealing with alerts, such as creating, editing, or deleting them.
 */
app.controller('AlertsController', function($scope, $location, $timeout, $routeParams, Alert) {
	
	// Get all alerts in the system.
	$scope.all = function() {
		$scope.n = $routeParams.n;
		$scope.error = $routeParams.error;
		Alert.all(function(res, status) {
			$scope.alerts = res.payload;
		});
	}
	
	// Create a alert.
	$scope.create = function() {
		Alert.create($scope.alert, function(res, status) {
			$timeout(function() {
				$scope.fade = true;
				$timeout(function() {
					$location.path('/Alerts').search({n: res.payload.id});
				}, 1000);
			}, 1500);
		});
	}
	
	// Get a alert.
	$scope.get = function() {
		Alert.get($routeParams.id, function(res) {
			$scope.alert = res.payload;
			$scope.show = true;
		});
	}
	
	// Save a alert.
	$scope.save = function() {
		Alert.save($routeParams.id, $scope.alert);
	}
	
	// Delete an alert.
	$scope.destroy = function(id, index) {
		if(confirm('Are you sure you want to delete this alert?')) {
			$scope.loading = true;
			Alert.destroy(id, function(res, status) {
				$scope.deleted = id;
				$timeout(function() {
					$scope.alerts.splice(index, 1);
				}, 1000);
			});
		}
	}
});