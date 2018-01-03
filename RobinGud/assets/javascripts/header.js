jQuery(document).ready(function($){  

	// login
	$('.press-login').bind('click', function(){
		$('.login-form-popup').show();
		e.preventDefault();
	});
	$('.login-form-popup button').bind('click', function(){
		$('.login-form-popup').hide();
		// need validation form add
		$('.press-login').hide();
		$('.profile-link').show();
		e.preventDefault();
	});

	// registration	
	$('.press-reg').bind('click', function(){
		$('.login-form-popup').hide();
		$('.reg-form-popup').show();
		e.preventDefault();
	});
	$('.reg-form-popup button').bind('click', function(){
		$('.reg-form-popup').hide();
		// need validation form add
		$('.press-login').hide();
		$('.profile-link').show();
		e.preventDefault();
	});

	// Menu side
	$('.menu-side-toggle').bind('click', function(){
		$('.overlay').show();
		$('#menu-side').show();
	});	
	$('#menu-side .close').bind('click', function(){
		$('.overlay').hide();
		$('#menu-side').hide();
	});

}); 
