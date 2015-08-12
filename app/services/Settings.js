/**
 * A service for retrieving and saving settings for the system.
 */
app.factory('Settings', function(API) {
	
	return {
		// Set the status of the house to resilient mode
		setResilientMode: function(boolean, success, error) {
			API.GET('/Settings/ResilientMode/' + boolean, success, error);
		},
		
		// Set the address of the house
		setAddress: function(data, success, error) {
			API.POST('/Settings/Address', data, success, error);
		},
		
		// Get the settings regarding the system
		getSettings: function(success, error) {
			API.GET('/Settings', success, error);
		}
	};
});