/**
 * Apply constants for different web app settings.
 */
// The different time periods to query
app.constant('PERIODS', {
	TODAY: 'T',
	YESTERDAY: 'Y',
	THIS_WEEK: 'W',
	THIS_MONTH: 'M'
});

// The amount of time to wait before refreshing a chart.
app.constant('REFRESH', 1000 * 6000);