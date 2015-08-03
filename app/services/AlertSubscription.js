/**
 * The AlertSubscription model.
 */
app.factory('AlertSubscription', function(API) {
	return {
		// Retrieve all alerts in the system, and whether or not the user subscribed to them.
		all: function(success, error) {
			API.GET('/Alerts/Subscriptions/All', success, error);
		},
		
		// Subscribee to multiple alerts.
		subscribeToMultiple: function(data, success, error) {
			API.POST('/Alerts/Subscriptions/Subscribe', data, success, error);
		}
	}
});