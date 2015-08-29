/**
 * Apply constants for different web app settings.
 */
// The different time periods to query
app.constant('PERIODS', {
	HOUR: 'H',
	LAST_HOUR: 'LH',
	TODAY: 'T',
	YESTERDAY: 'Y',
	THIS_WEEK: 'TW',
	LAST_WEEK: 'LW',
	THIS_MONTH: 'TM',
	LAST_MONTH: 'LM'
});

// The different types of charts to choose from
app.constant('TYPES', {
	BAR: 'bar',
	LINE: 'line',
	PIE: 'pie'
});

// The amount of time to wait before refreshing a chart.
app.constant('REFRESH', 1000 * 60);