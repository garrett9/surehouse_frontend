/**
 * The User model.
 */
app.factory('Query', function(API, PERIODS) {

	return {
		/**
		 * Initializes an object to hold query parameters for the reporter.
		 */
		init: function() {
			return {
				'sensors[]': [],
				'order_by': 'asc'
			};
		},

		// Given a set of parameters, and a period to query for, this function adds the aggregate parameter to the existing set of parameters
		addAggregate: function(params, period) {
			switch(period) {
				case PERIODS.TODAY:
				case PERIODS.YESTERDAY:
					params.aggregate = 1 * 60;
					break;
				case PERIODS.THIS_WEEK:
				case PERIODS.THIS_MONTH:
				default:
					params.aggregate = 1 * 24 * 60;
					break;
			}
		},
		
		// Given an existing set of parameters, and the time period to perform a most recent query, this function returns the new parameters to query with
		addRecentTimeParameters: function(parameters, period) {
			var date = new Date();
			var todaysMinutes = (date.getHours() * 60) + date.getMinutes();
			
			// Adds the time parameters to the existing parameters.
			var addParameters = function(timeParams) {
				for(var name in timeParams)
					parameters[name] = timeParams[name];
				return parameters;
			}

			// Depending on the type of period selected
			switch(period) {
				case PERIODS.TODAY:
					// Add the number of minutes that occured today
					return addParameters({
						minutes: todaysMinutes
					});
				case PERIODS.YESTERDAY:
					// Skip the number of minutes that occured today, and add 24 hours for yesterday
					return addParameters({
						minutes: 24 * 60,
						skip: todaysMinutes
					});
				case PERIODS.THIS_WEEK:
					// Add the number of minutes that occured for the previous days of the week, and then todays minutes
					return addParameters({
						minutes: (date.getDay() * 24 * 60) + todaysMinutes
					});
				case PERIODS.THIS_MONTH:
					// Add the number of minutes that occured for the previous days of the month, and then todays minutes
					return addParameters({
						minutes: ((date.getDate() - 1) * 24 * 60) + todaysMinutes
					});
				default: // Invalid period, so just return back the original parameters
					return parameters;
			}
		},
		
		// Given a JS object, this function converts it to a URL encoded query string.
		serializeParams: function(object, isCustom, prefix) {
			/*
			 * Depending on the type of query being performed, we must exclude
			 * certain parameters. Therefore, we place them in the following array
			 * so that the will be exclude from the resulting URL query parameters
			 * string.
			 */
			var exclude;
			if(isCustom)
				exclude = ['minutes', 'skip'];
			else
				exclude = ['fromTime', 'fromDate', 'toTime', 'toDate'];

			var str = [];
			for(var p in object) {
				if (object.hasOwnProperty(p) && object[p] && exclude.indexOf(object[p]) == -1) {
					var k = prefix ? prefix : p, v = object[p];
					str.push(typeof v == "object" ? this.serializeParams(v, isCustom, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
				}
			}

			return str.join("&");
		},

		// Performs a custom query with the back end data feeds of the SureHouse application.
		custom: function(data, success, error) {
			API.GET('/Reporting/Custom?' + this.serializeParams(data, true), success, error);
		},

		// Performs the same as a 'custom' request, except view POST
		customPost: function(data, success, error) {
			API.POST('/Reporting/Custom', data, success, error);
		},

		// Performs a "most recent" query with the back end feeds of the SureHouse application.
		recent: function(data, success, error) {
			API.GET('/Reporting/Recent?' + this.serializeParams(data, false), success, error);
		},

		// Performs the same as a 'most recent' request, except via POST
		recentPost: function(data, success, error) {
			API.POST('/Reporting/Recent', data, success, error);
		},

		// Handles a query by specifying what type of query it is.
		query: function(data, isCustom, success, error) {
			if(isCustom)
				this.custom(data, success, error);
			else
				this.recent(data, success, error);
		}
	};
});