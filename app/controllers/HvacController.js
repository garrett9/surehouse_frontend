/**
 * A controller for managing the temperature chart.
 */
app.controller('HvacController', function($scope, $interval) {

	// Initialize the options for displaying the chart
	$scope.initOptions = function() {
		$scope.options = {
				chart: {
					type: 'discreteBarChart',
					height: 450,
					margin : {
						top: 20,
						right: 20,
						bottom: 60,
						left: 55
					},
					x: function(d){return d.label;},
					y: function(d){return d.value;},
					showValues: true,
					valueFormat: function(d){
						return d3.format(',.1f')(d);
					},
					transitionDuration: 500,
					yAxis: {
						axisLabel: 'Y Axis',
						axisLabelDistance: 30
					}
				}
		};
	}

	// Retrieve the data to display in the chart
	$scope.getData = function() {
		$scope.data = [
		               {
		            	   key: "Cumulative Return",
		            	   values: [
		            	            {
		            	            	"label" : "Today" ,
		            	            	"value" : 1.2
		            	            } ,
		            	            {
		            	            	"label" : "Yesterday" ,
		            	            	"value" : 0.9
		            	            } ,
		            	            {
		            	            	"label" : "Balance" ,
		            	            	"value" : 1.3
		            	            }
		            	            ]
		               }
		               ];
	}

	// Initialize the chart
	$scope.initChart = function() {
		$scope.initOptions();
		$scope.getData();
	}

});