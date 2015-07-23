/**
 * The AlertsController handles anything dealing with alerts, such as creating, editing, or deleting them.
 */
app.controller('AlertsController', function($scope, $location, $timeout, $routeParams, Alert) {
	/**
	 * The Alert.
	 */
	$scope.alert = Alert.init();
	
	/**
	 * Return the text representation of the operation the alert has.
	 */
	$scope.operationText = function(operation) {
		switch(operation) {
		case '<':
			return "less than";
		case '>':
			return "greater than";
		case '<=':
			return "less than or equal to";
		case '>=':
			return "greater than or equal to";
		}
	}
	
	/**
	 * Get all alerts in the system.
	 */
	$scope.all = function() {
		$scope.new = $routeParams.new;
		$scope.error = $routeParams.error;
		Alert.all(function(res, status) {
			if(status == 200)
				$scope.alerts = res.payload;
			else {
				$scope.alerts = [];
				$scope.message = 'There are currently no alerts in the system.';
			}
		}, function(res) {
			$scope.error = 'The server failed to retrieve the alerts!';
		});
	}
	
	/**
	 * Create a alert.
	 */
	$scope.create = function() {
		$scope.loading = true;
		Alert.create($scope.alert, function(res, status) {
			$scope.alert = Alert.init();
			$scope.error = null;
			$scope.loading = false;
			$scope.success = 'Successfully created the alert.';
			$timeout(function() {
				$scope.fade = true;
				$timeout(function() {
					$location.path('/Alerts').search({new: res.payload.id});
				}, 1000);
			}, 1500);
		}, function(res) {
			$scope.loading = false;
			if(res != null && res.status == 400) {
				$scope.error = 'Could not create the alert. Please fix the errors in the form.';
				$scope.errors = res.payload;
			}
			else
				$scope.error = 'The server could not create the alert! Please contact support.';
		});
	}
	
	/**
	 * Get a alert.
	 */
	$scope.get = function() {
		Alert.get($routeParams.id, function(res) {
			console.log(res);
			$scope.alert.name = res.payload.name;
			$scope.alert.sensor = res.payload.sensor;
			$scope.alert.operation = res.payload.operation;
			$scope.alert.value = res.payload.value;
			$scope.alert.timespan = res.payload.timespan;
			$scope.show = true;
		}, function(res, status) {
			if(status == 404)
				$location.path('Alerts').search({error: 'The alert was not found!'});
			else
				$location.path('Alerts').search({error: 'The server could not retrieve the alert! Please contact support.'});
		});
	}
	
	/**
	 * Save a alert.
	 */
	$scope.save = function() {
		$scope.loading = true;
		Alert.save($routeParams.id, $scope.alert, function(res) {
			$scope.loading = false;
			$scope.error = null;
			$scope.success = 'Successfully saved your changes.';
			$scope.errors = null;
		}, function(res, status) {
			$scope.loading = false;
			$scope.success = null;
			if(status == 404)
				$location.path('Alerts').search({error: 'The alert was not found!'});
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
	 * Delete a alert.
	 */
	$scope.delete = function(id, index) {
		if(confirm('Are you sure you want to delete this alert?')) {
			$scope.loading = true;
			Alert.delete(id, function(res, status) {
				$scope.loading = false;
				$scope.success = 'The alert has been successfully deleted.';
				$scope.deleted = id;
				$timeout(function() {
					$scope.alerts.splice(index, 1);
				}, 1000);
			}, function(res, status) {
				$scope.loading = false;
				if(status == 404)
					$scope.error = 'The alert was not found!';
				else
					$scope.error = 'Failed to delete the alert!';
			});
		}
	}
});