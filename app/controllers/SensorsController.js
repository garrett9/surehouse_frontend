/**
 * The SensorsController handles anything dealing with sensors, such as creating, editing, or deleting them.
 */
app.controller('SensorsController', function($scope, $location, $timeout, $routeParams, Sensor) {
	// Get all sensors in the system.
	$scope.all = function() {
		$scope.n = $routeParams.n;
		Sensor.all(function(res, status) {
			$scope.sensors = res.payload;
			$scope.loaded = true;
		});
	}
	
	// Create a sensor.
	$scope.create = function() {
		Sensor.create($scope.sensor, function(res, status) {
			$timeout(function() {
				$scope.fade = true;
				$timeout(function() {
					$location.path('/Sensors').search({n: res.payload.id});
				}, 1000);
			}, 1500);
		});
	}
	
	// Get a sensor.
	$scope.get = function() {
		Sensor.get($routeParams.id, function(res) {
			$scope.sensor = res.payload;
			$scope.show = true;
		});
	}
	
	// Save a sensor.
	$scope.save = function() {
		Sensor.save($routeParams.id, $scope.sensor);
	}
	
	// Delete a sensor.
	$scope.destroy = function(id, index) {
		if(confirm('Are you sure you want to delete this sensor?')) {
			Sensor.destroy(id, function(res, status) {
				$scope.deleted = id;
				$timeout(function() {
					$scope.sensors.splice(index, 1);
				}, 1000);
			}, function(res, status) {
				if(status == 409)
					$scope.error = 'Could not delete the sensor because it is attached to an alert! You must delete the alerts monitoring this sensor before deleting it.';
			});
		}
	}
});