/**
 * A directive for handling the displaying of front end errors on forms through the bootstrap
 * has-error class.
 */
app.directive('errors', function() {
	return {
		restrict: 'A',
		scope: {
			errors: '='
		},
		link: function(scope, element, attrs) {
			//TODO figure out why I can't manipulate dom unless I used element.find
			scope.renderErrors = function(errors) {	
				element.find('[class*="form-group"]').removeClass('has-error');
				element.find('[class*="help-block"] > ul').remove();
				
				for(var name in scope.errors) {
					if(element.find('[name="' + name + '"]').parent().parent().hasClass('form-group')) {
						element.find('[name="' + name + '"]').parent().parent().addClass('has-error');
						
						if(!element.find('[name="' + name + '"] + div[class*="help-block"]').hasClass('help-block'))
							element.find('[name="' + name + '"]').after('<div class*="help-block"></div>')
						
						if(!angular.isArray(scope.errors[name]))
							element.find('[name="' + name + '"] + div[class*="help-block"]').append('<ul><li>' + scope.errors[name] + '</li></ul>');
						else {
							element.find('[name="' + name + '"] + div[class*="help-block"]').append('<ul></ul>');
							for(var i in scope.errors[name])
								element.find('[name="' + name + '"] + div[class*="help-block"] > ul').append('<li>' + scope.errors[name][i] + '</li>');
						}
					}
				}
			}
			
			scope.$watch('errors', function(errors) {
				scope.renderErrors(errors);
			});
		}
	};
});