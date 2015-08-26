/**
 * A controller for managing the Engery Pie Chart
 */
app.controller('TemperatureController', function($scope, $interval, Charter, Query, REFRESH) {
	var options_initialized = false;
	var params = {
		sensors: ['T_LIVING']
	};

	// Watch the period paremter
	$scope.$watch('period', function() {
		$scope.getData();
		options_initialized = false;
		Query.addAggregate(params, $scope.period);
	})

	// Retrieve the data to display in the chart
	$scope.getData = function() {
		if($scope.period) {
			Charter.query(params, $scope.period, function(data, units) {
				$scope.data = data;
				$scope.updated = new Date();

				if(!options_initialized) {
					$scope.options = Charter.initLineChartOptions(units, $scope.period);
					options_initialized = true;
				}
			});
		}
	}

	// Request for new data every minute
	$interval($scope.getData, REFRESH);
});