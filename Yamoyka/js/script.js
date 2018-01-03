jQuery(document).ready(function($){  

  // scroll header 
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('header').addClass('affix');
    }
    else {
      $('header').removeClass('affix');
    }
  });

	// gallery
	$(".owl-carousel").owlCarousel({
		loop: true,
		center: true,
		dots: false,
		nav: true
	});

	// скрываем все модальные окна
	$('.b-popup').hide();

	//маски для телефона
	$("[type=tel]").mask("8(999) 999-99-99");

	$('#zapis-send').on('click', function() {

	 	// Создадим данные формы и добавим в них данные файлов из files 
    var data = new FormData();
    data.append('name', $('#name1').val());
		data.append('phone', $('#phone1').val());

    name = $('#name1').val();
    tel = $('#phone1').val();

    if (name.length > 0) {

      if (tel.length > 0) {

        $('#zapis-send').attr('disabled', 'disabled');
        $('#zapis').submit(function() {event.preventDefault()});

        $.post(
          "../send.php",
          {
	          name: $('#name1').val(),
	          phone: $('#phone1').val()
          },
          onAjaxSuccess
        );

      } else {
        $("#phone1").focus();
      	$('#mess1').text('Поле телефон обязательно для заполнения');
      }

    } else {
      $("#name1").focus();
    	$('#mess1').text('Поле Имя обязательно для заполнения');
    }

    function onAjaxSuccess(data) {
      $('#zapis-send').val(data);
      $('#name1').val('');
      $('#phone1').val('');
      PopUpShow('popup');
    };

  });

  $('#zapis').on('submit', function (e) {
    e.stopPropagation(); // Остановка происходящего
    e.preventDefault();  // Полная остановка происходящего
  });

  ///////////////
	$('#sale-send').on('click', function() {

	 	// Создадим данные формы и добавим в них данные файлов из files 
    var data = new FormData();
    data.append('name', $('#name2').val());
		data.append('phone', $('#phone2').val());

    name = $('#name2').val();
    tel = $('#phone2').val();

    if (name.length > 0) {

      if (tel.length > 0) {

        $('#sale-send').attr('disabled', 'disabled');
        $('#sale').submit(function() {event.preventDefault()});

        $.post(
          "../sale.php",
          {
	          name: $('#name2').val(),
	          phone: $('#phone2').val()
          },
          onAjaxSuccess
        );

      } else {
        $("#phone2").focus();
      	$('#mess2').text('Поле телефон обязательно для заполнения');
      }

    } else {
      $("#name2").focus();
    	$('#mess2').text('Поле Имя обязательно для заполнения');
    }

    function onAjaxSuccess(data) {
      $('#sale-send').val(data);
      $('#name2').val('');
      $('#phone2').val('');
      PopUpShow('popup');
    };

  });

  $('#sale').on('submit', function (e) {
    e.stopPropagation(); // Остановка происходящего
    e.preventDefault();  // Полная остановка происходящего
  });

  ///////////////
	$('#call-form-send').on('click', function() {

	 	// Создадим данные формы и добавим в них данные файлов из files 
    var data = new FormData();
    data.append('name', $('#name3').val());
		data.append('phone', $('#phone3').val());

    name = $('#name3').val();
    tel = $('#phone3').val();

    if (name.length > 0) {

      if (tel.length > 0) {

        $('#call-form-send').attr('disabled', 'disabled');
        $('#call-form').submit(function() {event.preventDefault()});

        $.post(
          "../call.php",
          {
	          name: $('#name3').val(),
	          phone: $('#phone3').val()
          },
          onAjaxSuccess
        );

      } else {
        $("#phone3").focus();
      	$('#mess3').text('Поле телефон обязательно для заполнения');
      }

    } else {
      $("#name3").focus();
    	$('#mess3').text('Поле Имя обязательно для заполнения');
    }

    function onAjaxSuccess(data) {
      $('#call-form-send').val(data);
      $('#name3').val('');
      $('#phone3').val('');
      PopUpShow('popup');
    };

  });

  $('#call-form').on('submit', function (e) {
    e.stopPropagation(); // Остановка происходящего
    e.preventDefault();  // Полная остановка происходящего
  });

    ///////////////
	$('#sam-send').on('click', function() {

	 	// Создадим данные формы и добавим в них данные файлов из files 
    var data = new FormData();
    data.append('name', $('#name4').val());
		data.append('phone', $('#phone4').val());

    name = $('#name4').val();
    tel = $('#phone4').val();

    if (name.length > 0) {

      if (tel.length > 0) {

        $('#sam-send').attr('disabled', 'disabled');
        $('#sam').submit(function() {event.preventDefault()});

        $.post(
          "../sam.php",
          {
	          name: $('#name4').val(),
	          phone: $('#phone4').val()
          },
          onAjaxSuccess
        );

      } else {
        $("#phone4").focus();
      	$('#mess4').text('Поле телефон обязательно для заполнения');
      }

    } else {
      $("#name4").focus();
    	$('#mess4').text('Поле Имя обязательно для заполнения');
    }

    function onAjaxSuccess(data) {
      $('#sam-send').val(data);
      $('#name4').val('');
      $('#phone4').val('');
      PopUpShow('popup');
    };

  });

  $('#sam').on('submit', function (e) {
    e.stopPropagation(); // Остановка происходящего
    e.preventDefault();  // Полная остановка происходящего
  });
}); 

//popup
function PopUpShow(id){
  $('#'+id).show();
}
function PopUpHide(id){
  $('#'+id).hide();
  $("form").trigger('reset');
  // $(".formError").hide();
}