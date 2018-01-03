jQuery(document).ready(function($){  
	/* */

	$('.logo-slider ul').bxSlider({
		pager: false,
		maxSlides: 6,
		slideWidth: 70,
  	slideMargin: 122,
  	moveSlides: 1,
	});
	/* */

	$('.fancybox').fancybox();

	/* */
	$('#send').on('click', function() {

    name = $('#name').val();
    phone = $('#phone').val();
    email = $('#email').val();

    if (name.length > 0) {

      if (phone.length > 0) {
        $.post(
          "send.php",
          {
            name: $('#name').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
            message: $('#message').val()
          },
          onAjaxSuccess
        );

      } else {
        $('#phone').focus();
      }

    } else {
      $('#name').focus();
    }

    function onAjaxSuccess(data) {
      $('#name').val('');
      $('#phone').val('');
      $('#email').val('');
      $('#message').val('');
      $('#info').text(data);
    };

  });

  $('#form-1').on('submit', function (e) {
    e.preventDefault();
  });
}); 