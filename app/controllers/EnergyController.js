/**
 * A controller for managing the Engery Pie Chart
 */
app.controller('EnergyController', function($scope, $interval, Charter, REFRESH) {
	var params = {
			sensors: ['CT_EV', 'CT_COOKING', 'CT_LIGHTS', 'CT_FRIDGE', 'CT_MONITORING', 'CT_WASHER_DRYER'],
			absolute: 'true'
	};

	// Watch the period paremter
	$scope.$watch('period', function() {
		$scope.getData();
	})

	var options_initialized = false;
	// Retrieve the data to display in the chart
	$scope.getData = function() {
		if($scope.period) {
			Charter.query(params, $scope.period, function(data, units) {
				$scope.data = data;
				$scope.updated = new Date();

				if(!options_initialized) {
					$scope.options = Charter.initPieChartOptions(units);
					options_initialized = true;
				}
			});
		}
	}

	// Request for new data every minute
	$interval($scope.getData, REFRESH);
});