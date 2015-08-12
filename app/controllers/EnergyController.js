/**
 * A controller for managing the temperature chart.
 */
app.controller('EnergyController', function($scope, $interval) {

	// Initialize the options for displaying the chart
	$scope.initOptions = function() {
		$scope.options = {
				chart: {
					type: 'pieChart',
					height: 500,
					x: function(d){return d.key;},
					y: function(d){return d.y;},
					showLabels: false,
					transitionDuration: 500,
					labelThreshold: 0.01,
					legend: {
						margin: {
							top: 5,
							right: 35,
							bottom: 5,
							left: 0
						}
					}
				}
		};
	}

	// Retrieve the data to display in the chart
	$scope.getData = function() {
		$scope.data = [
		               {
		            	   key: "EV",
		            	   y: 30
		               },
		               {
		            	   key: "HVAC",
		            	   y: 5
		               },
		               {
		            	   key: "COOK",
		            	   y: 8
		               },
		               {
		            	   key: "CLEAN",
		            	   y: 7
		               },
		               {
		            	   key: "HOT WATER",
		            	   y: 6
		               },
		               {
		            	   key: "ENTERTAIN",
		            	   y: 3
		               },
		               {
		            	   key: "LIGHT",
		            	   y: 8
		               }
		               ];
	}

	// Initialize the chart
	$scope.initChart = function() {
		$scope.initOptions();
		$scope.getData();
	}

});