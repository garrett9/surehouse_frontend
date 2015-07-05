/**
 * The User model.
 */
app.factory('API', function($http, URLS) {
	
	/**
	 * Provided with a $http request, this function will call the callbacks of the request if they are not null.
	 */
	process = function(request, success, error) {
		if(success && typeof(success) === "function")
			request.success(success);
		if(error && typeof(error) === "function")
			request.error(error);
	}
	
	return {
		/**
		 * Perform a GET request.
		 */
		GET: function(path, success, error) {
			process($http.get(URLS.API + path), success, error);
		},
		
		/**
		 * Perform a POST request.
		 */
		POST: function(path, data, success, error) {
			process($http.post(URLS.API + path, data), success, error);
		},
		
		/**
		 * Perform a PUT request.
		 */
		PUT: function(path, data, success, error) {
			process($http.put(URLS.API + path, data), success, error);
		},
		
		/**
		 * Perform a DELETE request.
		 */
		DELETE: function(path, success, error) {
			process($http.delete(URLS.API + path), success, error);
		}
	};
});