$(document).ready(function() {

  //Валидация формы
  $(".send").validation(
    $("#msgName").validate({
      test: "blank letters", 
      invalid: function(){      
        $(this).parent().addClass('error');
        $(this).next().show();
        setTimeout(function () {
          $(this).next().hide();
          // $(this).parent().removeClass('error');
        }, 2600);
      },
      valid: function(){
        $(this).parent().removeClass('error');
      }
    }),
    $("#msgMail").validate({
      test: "blank email", 
      invalid: function(){      
        $(this).parent().addClass('error');
        $(this).next().show();
        setTimeout(function () {
          $(this).next().hide();
          // $(this).parent().removeClass('error');
        }, 2600);
      },
      valid: function(){
        $(this).parent().removeClass('error');
      }
    }),
    $("#message").validate({
      test: "blank", 
      invalid: function(){      
        $(this).parent().addClass('error');
        $(this).next().show();
        setTimeout(function () {
          $(this).next().hide();
          // $(this).parent().removeClass('error');
        }, 2600);
      },
      valid: function(){
        $(this).parent().removeClass('error');
      }
    })
  );

  //Валидация формы notify
  $("#notifySend").validation(
    $("#email-notify").validate({
      test: "blank email", 
      invalid: function(){      
        $(this).parent().addClass('error');
        $(this).next().show();
        setTimeout(function () {
          $("#email-notify").next().hide();
          // $(this).parent().removeClass('error');
        }, 2600);
      },
      valid: function(){
        $(this).parent().removeClass('error');
      }
    })
  );

  $("#contact-message").submit(function() {
    /* Act on the event */
    var msg = $("#contact-message").serialize();
    $.ajax({
        type: "POST",
        url: "res.php",
        data: msg,
        success: function(data) {
          // setTimeout(function () {
          //   $("#contact .inner").hide();
          //   $("#contact .results .access").show();
          // }, 2600);          
          $("#contact .inner").hide();
          $("#contact .results .access").show();
        },
        error:  function(xhr, str){
            // alert("Возникла ошибка!");

          $("#contact form").hide();
          $("#contact h3+p").hide();
          $("#contact .results .oops").show();
          setTimeout(function () {
            $("#contact form").show();
            $("#contact h3+p").show();
            $("#contact .results .oops").hide();
            $('#contact-message').find('input[type=text], input[type=email], textarea').val('');
          }, 2600);
        }
    });

    return false;
  });

  $("#notify").submit(function() {
    /* Act on the event */
    var msg = $("#notify").serialize();
    $.ajax({
        type: "POST",
        url: "notify.php",
        data: msg,
        success: function(data) {
          // setTimeout(function () {
          //   $("#contact .inner").hide();
          //   $("#contact .results .access").show();
          // }, 2600);  

          $("#download form").hide();
          $("#download .results .access").show();
        },
        error:  function(xhr, str){
            // alert("Возникла ошибка!");

          $("#download form").hide();
          $("#download .results .oops").show();
          setTimeout(function () {
            $("#download form").show();
            $("#download .results .oops").hide();
            $('#download').find('input[type=email]').val('');
          }, 2600);
        }
    });

    return false;
  });

});