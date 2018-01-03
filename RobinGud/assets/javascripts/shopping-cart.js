jQuery(document).ready(function($){  

	// input number
	$('.minus').click(function () {
		var input = $(this).parent().find('input');
		var min = input.attr('min')
		var new_val = +input.val() - + 1;
		new_val = new_val < min ? min : new_val;
		input.val(new_val);
		input.change();
		return false;
	});
	$('.plus').click(function () {
		var input = $(this).parent().find('input');
		var old_val = input.val();
		input.val(+old_val + + 1);
		input.change();
		return false;
	});

	// close and change cart
	$('.table-cart .close').bind('click', function(){
		self = $(this);
		$('.cart .overlay').show();

		$('.btn-cart').bind('click', function (){
			$('.cart .overlay').hide();
			self.parent().parent().hide();
		});

	});


	// checkout
	$('.btn-checkout').bind('click', function(){
		$(this).parent().hide();
	});

	// delivery
	$('#sp-kuryer').bind('click', function() {
		if ( $('#sp-kuryer').prop("checked") ) {
			$('.delivery table table').show();
		}
	});
	$('#sp-pochta').bind('click', function() {
		if ( !$('#sp-kuryer').prop("checked") ) {
			$('.delivery table table').hide();
		}
	});

	$('input[name="toplace"]').bind('click', function(){
		$('input[type="radio"]').parent().parent().parent().removeClass('check');
		$(this).parent().parent().parent().addClass('check');
	});

	$('#sp-pochta').bind('click', function(){
		$('input[type="radio"]').parent().parent().parent().removeClass('check');
		$(this).parent().parent().parent().addClass('check');
	});


	// label form placeholder
	$('input[type="text"], input[type="email"], input[type="tel"]').each(function(){
	  $(this).blur(); // чтобы сбросить фокус со всех полей при перезагрузке страницы в ie
		if($(this).val() != '') {
			$(this).prev().addClass('hide');
			$(this).parent().find('.clear-text').addClass('ct-show');
		}
	});

	$('input[type="text"], input[type="email"], input[type="tel"]').blur(function() {
		if ($(this).val() == '') $(this).prev().removeClass('hide');
	});

	$('input[type="text"], input[type="email"], input[type="tel"]').focus(function() {
		$(this).prev().addClass('hide');
	});

	$('input[type="text"], input[type="email"], input[type="tel"]').mouseover(function() {
		if ($(this).val() != '') {
			$(this).prev().addClass('hide');
			$(this).parent().find('.clear-text').addClass('ct-show');
		}
	});

	$('.clear-text').click(function() {
		$(this).parent().find('input[type="text"], input[type="email"], input[type="tel"]').val('').focus();
		$(this).removeClass('ct-show');

	});

	$('input[type="text"], input[type="email"], textarea').keyup(function() {
		if($(this).val() != '') {
			$(this).parent().find('.clear-text').addClass('ct-show');
		}
		else {$(this).parent().find('.clear-text').removeClass('ct-show');}
	});

}); 
