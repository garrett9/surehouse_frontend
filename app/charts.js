/**
 * A configuration file for defining the charts that should be made on the dashboard.
 */
app.constant('CHARTS', {
	'Temperature': {
		type: 'line',
		size: 12,
		params: {
			sensors: []
		}
	},
	
	'Energy': {
		type: 'pie',
		size: 6,
		params: {
			sensors: []
		}
	},
	
	'Energy for HVAC System': {
		type: 'bar',
		size: 6,
		params: {
			sensors: []
		}
	}
});