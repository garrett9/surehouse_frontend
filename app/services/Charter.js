/**
 * An Angular factory to assist in creating and formatting charts.
 */
app.factory('Charter', function(Query, PERIODS, TYPES) {

	return {

		// Format a data set retrieved from the APU
		formatData: function(type, payload) {
			var data = [];
			var averages = null;
			var units = {};
			switch(type) {
				case TYPES.LINE: // Build the data needed for a line graph
					var sensors = {};
					averages = {};
					for(var i in payload) {
						var timestamp = payload[i]['Time'];

						for(var name in payload[i]) {
							if(name == 'Time')
								continue;

							var value = payload[i][name];
							if(isNaN(value))
								value = 0;
							var display_name = name.substr(0, name.indexOf('.'));

							if(!units[display_name])
								units[display_name] = name.substr(name.indexOf('.') + 1, name.length);

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

					for(var name in sensors) {
						averages[name] = Math.round((averages[name]/sensors[name].length) * 10) / 10;
						data.push({
							key: name, 
							values:sensors[name], 
						});
					}
					break;
				case TYPES.BAR: // Build the data needed for a bar graph
					var values = [];
					for(var i in payload) {
						for(var name in payload[i]) {
							var display_name = name.substr(0, name.indexOf('.'));
							if(!units[display_name])
								units[display_name] = name.substr(name.indexOf('.') + 1, name.length);

							var value = payload[i][name];
							if(isNaN(value))
								value = 0;

							values.push({
								label: display_name,
								value: value
							});
						}
					}
					data.push({
						values: values
					});
					break;
				case TYPES.PIE: // Build the data needed for a pie graph
					for(var i in payload) {
						for(var name in payload[i]) {
							var display_name = name.substr(0, name.indexOf('.'));
							if(!units[display_name])
								units[display_name] = name.substr(name.indexOf('.') + 1, name.length);

							var value = payload[i][name];
							if(isNaN(value))
								value = 0;

							data.push({
								key: display_name,
								y: value
							});
						}
					}
					break;
				case TYPES.MULTI: // Build the data needed for a multi chart
					var sensors = {};
					averages = {};
					var firstUnits = null;
					for(var i in payload) {
						var timestamp = payload[i]['Time'];

						for(var name in payload[i]) {
							if(name == 'Time')
								continue;

							var value = payload[i][name];
							if(isNaN(value))
								value = 0;
							var display_name = name.substr(0, name.indexOf('.'));

							var units_display = name.substr(name.indexOf('.') + 1, name.length);
							units[display_name] = units_display;
							if(!firstUnits)
								firstUnits = units_display;

							if(!sensors[display_name]) {
								sensors[display_name] = {};
								sensors[display_name].values = [];
							}
							sensors[display_name].original_name = name;

							
							var values = [];
							values.x = timestamp;
							values.y = value;
							sensors[display_name].values.push(values);

							if(!averages[display_name])
								averages[display_name] = 0;
							averages[display_name] += value;
						}
					}


					for(var name in sensors) {
						averages[name] = Math.round((averages[name]/sensors[name].length) * 10) / 10;

						var axis = 1;
						if(units[name] != firstUnits)
							axis = 2;
						
						data.push({
							key: name, 
							values:sensors[name].values, 
							type: 'line',
							yAxis: axis
						});
					}
					break;
			}

			var results = {
					data: data,
					units: units
			}

			if(averages)
				results.averages = averages;

			return results;
		},

		// Performs a query given the parameters, and an optional time period. The function then formats the results from the API query to an angular-nv-d3 compatible data set, and then passes them along to the success callback
		query: function(type, params, period, success, error) {
			if(params['sensors[]'])
				params.sensors = params['sensors[]'];
			
			if(type == TYPES.LINE || type == TYPES.MULTI) {
				if(period)
					Query.addAggregate(params, period);
			}
			else
				delete params.aggregate;

			if(period)
				Query.addRecentTimeParameters(params, period);

			var closure;
			if(params.isCustom)
				closure = Query.customPost;
			else
				closure = Query.recentPost;

			var self = this;
			closure(params, function(res) {
				results = self.formatData(type, res.payload);
				success(results.data, results.units, results.averages)
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

					tooltip: {
						contentGenerator: function(data) {
							var display_units = (units[data.data.key]) ? units[data.data.key] : '';

							var string = '<table>';
							string += '<tr><td><div class="small-box" style="background-color:' + data.color + ';"></div> ' + data.data.key + '</td>';
							string += '<td aligh="right"><strong>' + data.data.y + ' ' + display_units + '</strong></td></tr>';
							string += '</table>';
							return string;
						},
					},

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

		// Initializes the options for a multi line chart
		initMultiChartOptions: function(units, period, averages) {
			var dateFormat = '%x %I:%M %p';

			return {
				chart: {
	                type: 'multiChart',
	                height: 450,
	                margin : {
	                    top: 30,
	                    right: 60,
	                    bottom: 50,
	                    left: 70
	                },
	                color: d3.scale.category10().range(),
	                useInteractiveGuideline: true,
	                transitionDuration: 500,
	                
	                tooltip: {
						contentGenerator: function(data) {
							var date = new Date(data.series[0].value);
							var half = 'AM';
							var hours = date.getHours();
							if(hours >= 12) {
								hours -= 12;
								half = 'PM';
							}
							
							var minutes = date.getMinutes();
							if(minutes < 10)
								minutes = '0' + minutes;
							
							date = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + half;
							var string = '<table>';
							string += '<tr><td><strong>' + date + '</strong></td><td></td></tr>';
							string += '<tr><td><div class="small-box" style="background-color:' + data.series[0].color + ';"></div>' + data.series[0].value + '</td></tr>';
							string += '</table>';
							
							return string;
						}
					},
	                
	                xAxis: {
	                	axisLabel: 'Time',
	                    tickFormat: function(d){
	                    	return d3.time.format(dateFormat)(new Date(d))
	                    }
	                },
	                yAxis1: {
	                    tickFormat: function(d){
	                        return d3.format(',.1f')(d);
	                    }
	                },
	                yAxis2: {
	                    tickFormat: function(d){
	                        return d3.format(',.1f')(d);
	                    }
	                }
	            }
			};
		},

		// Initializes the options for a Cumulative line chart
		initLineChartOptions: function(units, period, averages) {
			var dateFormat = '%x %I:%M %p';

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

					callback: function(chart) {
						chart.interactiveLayer.tooltip.contentGenerator(function(data) {
							var string = '<table>';
							string += '<tr><td><strong>' + data.value + '</strong></td><td></td></tr>';
							for(var i in data.series) {
								string += '<tr><td><div class="small-box" style="background-color:' + data.series[i].color + ';"></div> ' + data.series[i].key + '</td>';

								var display_units = (units[data.series[i].key]) ? units[data.series[i].key] : '';

								if(averages && averages[data.series[i].key]) {
									string += '<td>Average:</td>';
									string += '<td align="right"><strong>' + averages[data.series[i].key] + ' ' + display_units + '</strong></td>';
									string += '<td>Value:</td>';
								}

								string += '<td align="right"><strong>' + data.series[i].value + ' ' + display_units + '</strong></td>';


								string += '</tr>'; 
							}
							string += '</table>';
							return string;
						});
						return chart;
					},

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

//		Initializes the options for a discrete bar graph
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
					x: function(d){return d.label; },
					y: function(d){return d.value; },
					showValues: true,

					tooltip: {
						contentGenerator: function(data) {
							var display_units = (units[data.data.label]) ? units[data.data.label] : '';

							var string = '<table>';
							string += '<tr><td><div class="small-box" style="background-color:' + data.color + ';"></div> ' + data.data.label + '</td>';
							string += '<td aligh="right"><strong>' + data.data.value + ' ' + display_units + '</strong></td></tr>';
							string += '</table>';
							return string;
						},
					},

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