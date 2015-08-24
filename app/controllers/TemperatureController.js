/**
 * A controller for managing the temperature chart.
 */
app.controller('TemperatureController', function($scope, $interval) {

	// Initialize the options for displaying the chart
	$scope.initOptions = function() {
		$scope.options = {
				chart: {
					type: 'cumulativeLineChart',
					height: 450,
					margin : {
						top: 20,
						right: 20,
						bottom: 60,
						left: 65
					},
					x: function(d){ return d[0]; },
					y: function(d){ return d[1]/100; },
					average: function(d) { return d.mean/100; },

					color: d3.scale.category10().range(),
					transitionDuration: 300,
					useInteractiveGuideline: true,
					clipVoronoi: false,

					xAxis: {
						axisLabel: 'X Axis',
						tickFormat: function(d) {
							return d3.time.format('%m/%d/%y')(new Date(d))
						},
						showMaxMin: false,
						staggerLabels: true
					},

					yAxis: {
						axisLabel: 'Y Axis',
						tickFormat: function(d){
							return d3.format(',.1%')(d);
						},
						axisLabelDistance: 20
					}
				}
		};
	}

	// Retrieve the data to display in the chart
	$scope.getData = function() {
		$scope.data = [
		               {
		            	   key: "Outside",
		            	   values: [[ 1 , 80], [ 2 , 81], [ 3 , 85], [ 4 , 85], [ 5 , 78]]
		               },
		               {
		            	   key: "Avg Inside",
		            	   values: [[ 1 , 72], [ 2, 75], [ 3 , 77], [ 4 , 77], [ 5 , 70]]
		               },
		               {
		            	   key: "Max Inside",
		            	   mean: 125,
		            	   values: [[ 1 , 77], [ 2 , 80], [ 3 , 82], [ 4 , 82], [ 5 , 75]]
		               },
		               {
		            	   key: "Min Inside",
		            	   values: [[ 1 , 67], [ 2 , 70], [ 3 , 72], [4 , 72], [ 5 , 65]]
		               }
		               ];
	}

	// Initialize the chart
	$scope.initChart = function() {
		$scope.initOptions();
		$scope.getData();
	}
});