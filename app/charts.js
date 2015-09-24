// Function to execute before a bar graph showing today and yesterday is displayed
var beforeRender = function(config) {
	var data = config.data;
	var Charter = config.Charter;
	
	// Calculate the sum for the first query
	var sum = 0;
	if(data.length > 0) {
		for(var i in data[0].values)
			sum += data[0].values[i].value;
	}

	// Perform a query for yersterday's values
	Charter.query(config.type, config.params, 'Y', function(new_data) {
		
		// Calculate the second query's sum
		var yestSum = 0;
		if(new_data.length > 0) {
			for(var i in new_data[0].values)
				yestSum += new_data[0].values[i].value;
		}

		data[0].values = [{label: 'Today', value: sum/60}, {label: 'Yesterday', value:yestSum/60}, {label: 'Budget', value: 600/60}];
		config.promise(data);
	});
	
	config.promise([]);
}

/**
 * A configuration file for defining the charts that should be made on the dashboard.
 */
app.constant('CHARTS', [
	[{
		title: 'Temperature',
		type: 'line',
		description: 'Living temperature.',
		icon: 'wi wi-thermometer',
		size: 12,
		params: {
			sensors: ['T_LIVING']
		}
	}],
	
	[{
		title: 'Energy',
		description: 'Basic energy usage.',
		icon: 'fa fa-plug',
		type: 'pie',
		size: 6,
		allowTypeSelection: true,
		params: {
			sensors: ['CT_EV', 'CT_COOKING', 'CT_LIGHTS', 'CT_FRIDGE', 'CT_MONITORING', 'CT_WASHER_DRYER'],
			absolute: 'true'
		}
	},
	
	{
		title: 'Energy Use',
		description: 'Energy usage for ACCU, AHU, and ERV.',
		icon: 'fa fa-plug',
		type: 'line',
		allowTypeSelection: true,
		size: 6,
		params: {
			sensors: ['CT_ACCU', 'CT_AHU', 'CT_ERV'],
			absolute: 'true'
		}
	}],
	
	[{
		title: 'Humidity',
		description: 'Living Humidity.',
		icon: 'wi wi-barometer',
		type: 'line',
		size: 6,
		params: {
			sensors: ['RH_LIVING']
		}
	},
	
	{
		title: 'Energy for HVAC system.',
		type: 'bar',
		icon: 'fa fa-bar-chart',
		size: 6,
		period: 'TM',
		params: {
			sensors: ['CT_ACCU', 'CT_AHU', 'CT_ERV'],
			absolute: 'true'
		},
		dontShowPeriods: true,
		beforeRender: beforeRender
	}],
	
	[{
		title: 'AC Energy for Hot Water.',
		type: 'bar',
		icon: 'fa fa-bar-chart',
		size: 6,
		period: 'TM',
		params: {
			sensors: ['CT_DHW'],
			absolute: 'true'
		},
		dontShowPeriods: true,
		beforeRender: beforeRender
	}, 
	
	/*{
		title: 'Multi-Chart Test',
		type: 'multi',
		size: 6,
		period: 'TM',
		params: {
			sensors: ['T_LIVING', 'RH_LIVING']
		}
	}*/]
]);