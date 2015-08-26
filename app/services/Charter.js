/**
 * An Angular factory to assist in creating and formatting charts.
 */
app.factory('Charter', function(Query, PERIODS) {

	return {
		
		// Performs a query given the parameters, and an optional time period. The function then formats the results from the API query to an angular-nv-d3 compatible data set, and then passes them along to the success callback
		query: function(params, period, success, error) {
			Query.addRecentTimeParameters(params, period);

			Query.recentPost(params, function(res) {
				var data = [];
				var averages = {};
				var units = null;
				if(params.aggregate && params.aggregate > 0) {
					var sensors = {};
					for(var i in res.payload) {
						var timestamp = res.payload[i]['Time'];

						for(var name in res.payload[i]) {
							if(name == 'Time')
								continue;

							var value = res.payload[i][name];
							var display_name = name.substr(0, name.indexOf('.'));
							units = name.substr(name.indexOf('.') + 1, name.length);

							if(!sensors[display_name])
								sensors[display_name] = [];

							var values = [];
							values[0] = timestamp;
							values[1] = value;
							sensors[display_name].push(values);

							if(!averages[display_name])
								averages[display_name] = 0;
							averages[display_name] += value;
						}
					}
					for(var name in sensors) 
						data.push({
							key: name, 
							values:sensors[name], 
							average:averages[name]/sensors[name].length
						});
				}
				else {
					for(var i in res.payload) {
						for(var name in res.payload[i]) {
							var display_name = name.substr(0, name.indexOf('.'));
							if(units == null)
								units = name.substr(name.indexOf('.') + 1, name.length);
							data.push({
								key: display_name,
								y: res.payload[i][name]
							});
						}
					}
				}

				success(data, units);
			}, error);
		},

		// Initializes the options for a Pie chart and returns them
		initPieChartOptions: function(units) {
			return {
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
		},

		// Initializes the options for a Cumulative line chart
		initLineChartOptions: function(units, period) {
			var dateFormat;
			switch(period) {
				case PERIODS.TODAY:
				case PERIODS.YESTERDAY:
					dateFormat = "%H:%M";
					break;
				case PERIODS.THIS_WEEK:
				case PERIODS.THIS_MONTH:
				default:
					dateFormat = "%x";
					break;
			}

			return {
				chart: {
					type: 'lineChart',
					height: 450,
					margin : {
						top: 20,
						right: 20,
						bottom: 60,
						left: 65
					},
					x: function(d){ return d[0]; },
					y: function(d){ return d[1]; },

					color: d3.scale.category10().range(),
					transitionDuration: 300,
					useInteractiveGuideline: true,
					clipVoronoi: false,

					xAxis: {
						axisLabel: 'Time',
						tickFormat: function(d) {
							return d3.time.format(dateFormat)(new Date(d))
						},
						showMaxMin: false,
						staggerLabels: true
					},

					yAxis: {
						axisLabel: units,
						axisLabelDistance: 20
					}
				}
			};
		},
		
		// Initializes the options for a discrete bar graph
		initDiscreteBarGraphOptions: function(units) {
			return {
					chart: {
						type: 'discreteBarChart',
						height: 450,
						margin : {
							top: 20,
							right: 20,
							bottom: 60,
							left: 55
						},
						x: function(d){return d.key; },
						y: function(d){return d.y; },
						showValues: true,
						valueFormat: function(d){
							return d3.format(',.1f')(d);
						},
						transitionDuration: 500,
						yAxis: {
							axisLabel: units,
							axisLabelDistance: 30
						}
					}
			};
		}
	}
});