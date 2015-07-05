/**
 * The User model.
 */
app.factory('Gateway', function($http, API) {
	return {
		/**
		 * Initialize an empty user instance.
		 */
		init: function() {
			return {
				name: "",
				IP: "",
				port: "",
				type: ""
			}
		},

		/**
		 * Get all users.
		 */
		all: function(success, error) {
			API.GET('/Gateways', success, error);
		},
		
		/**
		 * Create a user.
		 */
		create: function(data, success, error) {
			API.POST('/Gateways/Create', data, success, error);
		},
		
		/**
		 * Get a user.
		 */
		get: function(id, success, error) {
			API.GET('/Gateways', success, error);
		},
		
		/**
		 * Save a user.
		 */
		save: function(id, data, success, error) {
			API.PUT('/Gateways/Edit/' + id, data, success, error);
		},
		
		/**
		 * Delete a user.
		 */
		delete: function(id, success, error) {
			API.DELETE('/Gatweays/Delete/' + id, success, error);
		}
	};
});