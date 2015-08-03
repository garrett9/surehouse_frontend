/**
 * The GatewaysController handles anything dealing with gateways, such as creating, editing, or deleting them.
 */
app.controller('GatewaysController', function($scope, $location, $timeout, $routeParams, Gateway) {
	// Get all gateways in the system.
	$scope.all = function() {
		$scope.n = $routeParams.n;
		Gateway.all(function(res, status) {
			$scope.gateways = res.payload;
		});
	}
	
	// Create a gateway.
	$scope.create = function() {
		Gateway.create($scope.gateway, function(res, status) {
			delete $scope.gateway
			$timeout(function() {
				$scope.fade = true;
				$timeout(function() {
					$location.path('/Gateways').search({n: res.payload.id});
				}, 1000);
			}, 1500);
		});
	}
	
	// Get a gateway.
	$scope.get = function() {
		Gateway.get($routeParams.id, function(res) {
			$scope.gateway = res.payload;
			$scope.show = true;
		});
	}
	
	// Save a gateway.
	$scope.save = function() {
		Gateway.save($routeParams.id, $scope.gateway);
	}
	
	/**
	 * Delete a gateway.
	 */
	$scope.destroy = function(id, index) {
		delete $scope.message;
		if(confirm('Are you sure you want to delete this gateway?')) {
			Gateway.destroy(id, function(res, status) {
				$timeout(function() {
					$scope.gateways.splice(index, 1);
				}, 1000);
			}, function(res, status) {
				if(status == 409)
					$scope.message = "Could not delete the gateway because it is attached to an sensor! You must delete the sensors routing through this gateway before deleting it."
			});
		}
	}
});