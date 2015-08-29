/**
 * A controller for managing the Engery Pie Chart
 */
app.controller('ChartController', function($scope, $interval, Charter, Query, REFRESH, PERIODS, TYPES) {
	var params;
	var beforeRender;
	var options_initialized = false;
	var dontShowAverages;

	$scope.toolTipContentFunction = function(){
		return function(key, x, y, e, graph) {
	    	return  'Super New Tooltip' +
	        	'<h1>' + key + '</h1>' +
	            '<p>' +  y + ' at ' + x + '</p>'
		}
	}
	
	// Load pre-existing data into a chart
	$scope.loadData = function(type, data) {
		$scope.type = type; 
		var results = Charter.formatData($scope.type, data);
		$scope.data = results.data;
	    setOptions(results.units);
	}

	// Initializes the controller with the 
	$scope.init = function(chart_type, initialization_params, period, beforeRenderClosure, dontShowAveragesIn) {
		$scope.type = chart_type;
		params = initialization_params;
		$scope.period = (period) ? period : PERIODS.TODAY;
		beforeRender = beforeRenderClosure;
		dontShowAverages = dontShowAveragesIn;
		
		// Make the first request to get data
		$scope.getData();

		// Watch the period parameter in the scope to see if we need to go and query a new data set with a different timespan
		$scope.$watch('period', function(newVal, oldVal) {
			// Only execute if the old value was originally an actual value, and has changed
			if(oldVal && oldVal != newVal) {
				options_initialized = false;
				$scope.getData();
			}
		})

		// Watch the type parameter in the scope to see if we need to change the type of chart being displayed
		$scope.$watch('type', function(newVal, oldVal) {
			// Only execute if the old value was originally an actual value, and has changed
			if(oldVal && oldVal != newVal) {
				options_initialized = false;
				$scope.getData();
			}
		})
	}

	// Sets the options for the chart based on the provided type of chart
	var setOptions = function(units, averages) {
		$scope.units = units;
		switch($scope.type) {
			case TYPES.LINE:
				$scope.options = Charter.initLineChartOptions(units, $scope.period, averages);
				break;
			case TYPES.BAR:
				$scope.options = Charter.initDiscreteBarGraphOptions(units, $scope.period);
				break;
			case TYPES.PIE:
				$scope.options = Charter.initPieChartOptions(units, $scope.period);
				break;
		}
	};

	// Retrieve the data to display in the chart
	$scope.getData = function() {
		if($scope.period) {
			Charter.query($scope.type, params, $scope.period, function(data, units, averages) {
				var promise = function(data) {
					$scope.data = data;
					$scope.updated = new Date();

					if(!options_initialized) {
						if(!dontShowAverages)
							setOptions(units, averages);
						else
							setOptions(units);
						options_initialized = true;
					}
				}

				if(angular.isFunction(beforeRender))
					beforeRender({
						data: data,
						promise: promise,
						Charter: Charter,
						params: params,
						type: $scope.type
					});
				else
					promise(data);
			}, function() {
				$scope.data = [];
			});
		}
	}

	// Request for new data every minute
	$interval($scope.getData, REFRESH);
});