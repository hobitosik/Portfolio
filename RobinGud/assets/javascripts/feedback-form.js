jQuery(document).ready(function($){  

	$('.feedback-form input[type=file]').change(function() {
		if ($('.feedback-form input[type=file]').val() != '') {
			var file = $('.feedback-form input[type=file]').val();
		} else {
			var file = 'Выберите фото';
		}
		$('#filePhoto').text(file);
	});

}); 
