/**
 * The SensorsController handles anything dealing with sensors, such as creating, editing, or deleting them.
 */
app.controller('SensorsController', function($scope, $location, $timeout, $routeParams, Sensor) {
	/**
	 * The Sensor.
	 */
	$scope.sensor = Sensor.init();
	$scope.loaded = false;
	
	/**
	 * Get all sensors in the system.
	 */
	$scope.all = function() {
		$scope.new = $routeParams.new;
		$scope.error = $routeParams.error;
		Sensor.all(function(res, status) {
			$scope.loaded = true;
			if(status == 200)
				$scope.sensors = res.payload;
			else {
				$scope.sensors = [];
				$scope.message = 'There are currently no sensors in the system.';
			}
		}, function(res) {
			$scope.loading = true;
			$scope.error = 'You are not allowed to access this content!';
		});
	}
	
	/**
	 * Create a sensor.
	 */
	$scope.create = function() {
		$scope.loading = true;
		Sensor.create($scope.sensor, function(res, status) {
			$scope.sensor = Sensor.init();
			$scope.error = null;
			$scope.loading = false;
			$scope.success = 'Successfully created the sensor.';
			$timeout(function() {
				$scope.fade = true;
				$timeout(function() {
					$location.path('/Sensors').search({new: res.payload.id});
				}, 1000);
			}, 1500);
		}, function(res) {
			$scope.loading = false;
			if(res != null && res.status == 400) {
				$scope.error = 'Could not create the sensor. Please fix the errors in the form.';
				$scope.errors = res.payload;
			}
			else
				$scope.error = 'The server could not create the sensor! Please contact support.';
		});
	}
	
	/**
	 * Get a sensor.
	 */
	$scope.get = function() {
		Sensor.get($routeParams.id, function(res) {
			$scope.sensor.name = res.payload.name;
			$scope.sensor.gateway = res.payload.gateway;
			$scope.sensor.display_name = res.payload.display_name;
			$scope.sensor.units = res.payload.units;
			$scope.show = true;
		}, function(res, status) {
			if(status == 404)
				$location.path('Sensors').search({error: 'The sensor was not found!'});
			else
				$location.path('Sensors').search({error: 'The server could not retrieve the sensor! Please contact support.'});
		});
	}
	
	/**
	 * Save a sensor.
	 */
	$scope.save = function() {
		$scope.loading = true;
		Sensor.save($routeParams.id, $scope.sensor, function(res) {
			$scope.loading = false;
			$scope.error = null;
			$scope.success = 'Successfully saved your changes.';
			$scope.errors = null;
		}, function(res, status) {
			$scope.loading = false;
			$scope.success = null;
			if(status == 404)
				$location.path('Sensors').search({error: 'The sensor was not found!'});
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
	 * Delete a sensor.
	 */
	$scope.delete = function(id, index) {
		if(confirm('Are you sure you want to delete this sensor?')) {
			Sensor.delete(id, function(res, status) {
				$scope.success = 'The sensor has been successfully deleted.';
				$scope.deleted = id;
				$timeout(function() {
					$scope.sensors.splice(index, 1);
				}, 1000);
			}, function(res, status) {
				console.log(status);
				if(status == 404)
					$scope.error = 'The sensor was not found!';
				else if(status == 409)
					$scope.error = "Could not delete the sensor because it is attached to an alert! You must delete the alerts monitoring this sensor before deleting it."
				else
					$scope.error = 'Failed to delete the sensor!';
			});
		}
	}
});