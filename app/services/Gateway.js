/**
 * The User model.
 */
app.factory('Gateway', function(API) {
	return {
		// Get all users.
		all: function(success, error) {
			API.GET('/Gateways', success, error);
		},
		
		// Create a user.
		create: function(data, success, error) {
			API.POST('/Gateways/Create', data, success, error);
		},
		
		// Get a user.
		get: function(id, success, error) {
			API.GET('/Gateways/' + id, success, error);
		},
		
		// Save a user.
		save: function(id, data, success, error) {
			API.PUT('/Gateways/Edit/' + id, data, success, error);
		},
		
		// Delete a user.
		destroy: function(id, success, error) {
			API.DELETE('/Gateways/Delete/' + id, success, error);
		}
	};
});