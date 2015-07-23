/**
 * The User model.
 */
app.factory('Query', function(API) {
	
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
		
		/**
		 * Given a JS object, this function converts it to a URL encoded query string.
		 */
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
		
		/**
		 * Performs a custom query with the back end data feeds of the SureHouse application.
		 */
		custom: function(data, success, error) {
			API.GET('/Reporting/Custom?' + this.serializeParams(data, true), success, error);
		},
		
		/**
		 * Performs a "most recent" query with the back end feeds of the SureHouse application.
		 */
		recent: function(data, success, error) {
			API.GET('/Reporting/Recent?' + this.serializeParams(data, false), success, error);
		},
		
		/**
		 * Handles a query by specifying what type of query it is.
		 */
		query: function(data, isCustom, success, error) {
			if(isCustom)
				this.custom(data, success, error);
			else
				this.recent(data, success, error);
		}
	};
});