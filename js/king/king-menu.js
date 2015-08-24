$(document).ready(function() {

	/************************
	/*	MAIN NAVIGATION
	/************************/

	$('.main-menu .js-sub-menu-toggle').click( function(e){

		e.preventDefault();

		$li = $(this).parent('li');
		if( !$li.hasClass('active')){
			$li.find(' > a .toggle-icon').removeClass('fa-angle-left').addClass('fa-angle-down');
			$li.addClass('active');
		}
		else {
			$li.find(' > a .toggle-icon').removeClass('fa-angle-down').addClass('fa-angle-left');
			$li.removeClass('active');
		} 

		$li.find(' > .sub-menu').slideToggle(300);
	});

	$('.js-toggle-minified').clickToggle(
		function() {
			$('.left-sidebar').addClass('minified');
			$('.content-wrapper').addClass('expanded');

			$('.left-sidebar .sub-menu')
			.css('display', 'none')
			.css('overflow', 'hidden');

			$('.main-menu > li > a > .text').animate({
					opacity: 0
			}, 200);

			$('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');
		},
		function() {
			$('.left-sidebar').removeClass('minified');
			$('.content-wrapper').removeClass('expanded');
			$('.main-menu > li > a > .text').animate({
				opacity: 1
			}, 600);

			$('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');
		}
	);

	// main responsive nav toggle
	$('.main-nav-toggle').clickToggle(
		function() {
			$('.left-sidebar').slideDown(300)
		},
		function() {
			$('.left-sidebar').slideUp(300);
		}
	);
});

//toggle function
$.fn.clickToggle = function( f1, f2 ) {
	return this.each( function() {
		var clicked = false;
		$(this).bind('click', function() {
			if(clicked) {
				clicked = false;
				return f2.apply(this, arguments);
			}

			clicked = true;
			return f1.apply(this, arguments);
		});
	});
}

