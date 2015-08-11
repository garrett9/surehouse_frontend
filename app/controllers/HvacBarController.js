app.controller('HvacBarController', function($scope, $location, $timeout, Query) {

	// Initialize the options to use in the chart
	var init_options = function() {
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
					title: {
						enable: true,
						text: "Title for Line Chart"
					},
					x: function(d){return d.label;},
					y: function(d){return d.value;},
					showValues: true,
					valueFormat: function(d){
						return d3.format(',1')(d);
					},
					title: {
						enable: true,
						text: "Write Your Title",
						className: "h4",
						css: {
							width: "nullpx",
							textAlign: "center"
						}
					},
					transitionDuration: 500,
					yAxis: {
						axisLabel: '%',
						axisLabelDistance: 30
					}
				}
		};
	}

	// Retrieve the information needed for the chart
	var get_data = function() {
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
		            	            	"label" : "Budget" ,
		            	            	"value" : 1.3
		            	            }

		            	            ]
		               }
		               ];
	}

	// Initialize the information the chart needs to display
	$scope.init_hvac_bar = function() {
		init_options();
		get_data();
	}

});