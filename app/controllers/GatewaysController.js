/**
 * The GatewaysController handles anything dealing with gateways, such as creating, editing, or deleting them.
 */
app.controller('GatewaysController', function($scope, $location, $timeout, $routeParams, Gateway) {
	/**
	 * The Gateway.
	 */
	$scope.gateway = Gateway.init();
	
	/**
	 * Get all gateways in the system.
	 */
	$scope.all = function() {
		$scope.new = $routeParams.new;
		$scope.error = $routeParams.error;
		Gateway.all(function(res, status) {
			if(status == 200)
				$scope.gateways = res.payload;
			else {
				$scope.gateways = [];
				$scope.message = 'There are currently no gateways in the system.';
			}
		}, function(res) {
			$scope.error = 'You are not allowed to access this content!';
		});
	}
	
	/**
	 * Create a gateway.
	 */
	$scope.create = function() {
		$scope.loading = true;
		Gateway.create($scope.gateway, function(res, status) {
			$scope.gateway = Gateway.init();
			$scope.error = null;
			$scope.loading = false;
			$scope.success = 'Successfully created the gateway.';
			$timeout(function() {
				$scope.fade = true;
				$timeout(function() {
					$location.path('/Gateways').search({new: res.payload.id});
				}, 1000);
			}, 1500);
		}, function(res) {
			$scope.loading = false;
			if(res != null && res.status == 400) {
				$scope.error = 'Could not create the gateway. Please fix the errors in the form.';
				$scope.errors = res.payload;
			}
			else
				$scope.error = 'The server could not create the gateway! Please contact support.';
		});
	}
	
	/**
	 * Get a gateway.
	 */
	$scope.get = function() {
		Gateway.get($routeParams.id, function(res) {
			$scope.gateway.name = res.payload.name;
			$scope.gateway.IP = res.payload.IP;
			$scope.gateway.port = res.payload.port;
			$scope.gateway.type = res.payload.type;
			$scope.show = true;
		}, function(res, status) {
			if(status == 404)
				$location.path('Gateways').search({error: 'The gateway was not found!'});
			else
				$location.path('Gateways').search({error: 'The server could not retrieve the gateway! Please contact support.'});
		});
	}
	
	/**
	 * Save a gateway.
	 */
	$scope.save = function() {
		$scope.loading = true;
		Gateway.save($routeParams.id, $scope.gateway, function(res) {
			$scope.loading = false;
			$scope.error = null;
			$scope.success = 'Successfully saved your changes.';
			$scope.errors = null;
		}, function(res, status) {
			$scope.loading = false;
			$scope.success = null;
			if(status == 404)
				$location.path('Gateways').search({error: 'The gateway was not found!'});
			else {
				if(res != null && res.status == 400) {
					$scope.error = 'Could not save your changes! Please fix the errors in the form.';
					$scope.errors = res.payload;
				}
				else
					$scope.error = 'The server could not save your changes! Please contact support.';
			}
		});
	}
	
	/**
	 * Delete a gateway.
	 */
	$scope.delete = function(id, index) {
		if(confirm('Are you sure you want to delete this gateway?')) {
			Gateway.delete(id, function(res, status) {
				$scope.success = 'The gateway has been successfully deleted.';
				$scope.deleted = id;
				$timeout(function() {
					$scope.gateways.splice(index, 1);
				}, 1000);
			}, function(res, status) {
				if(status == 404)
					$scope.error = 'The gateway was not found!';
				else if(status == 409)
					$scope.error = "Could not delete the gateway because it is attached to an sensor! You must delete the sensors routing through this gateway before deleting it."
				else
					$scope.error = 'Failed to delete the gateway!';
			});
		}
	}
});