$(document).ready(function() {

  s_start = $("body").scrollTop();
  ImgHeight();

  $(window).resize(function(){

    var page_w = $('body').width();  
    if (page_w < 980 || page_w == 980 ) {
      $('body').addClass('mobile');
    } else {
      $('body').removeClass('mobile');
      $('.mobile-nav ul').hide();
    }

    if (page_w < 765 || page_w == 765 ) {
      $('body').addClass('slider_has');
    } else {
      $('body').removeClass('slider_has');
      $('.mobile-nav ul').hide();
    }

    ImgHeight();

  });


  $('.mobile-nav .toggle').click(function() { 
    $('.mobile-nav ul').toggle();
  });

  $('.mobile a').bind("click", function(e){
    $('.mobile-nav ul').hide();
    e.preventDefault();
  });

  // якоря меню
  $('a[href*=#]').bind("click", function(e){
	  var anchor = $(this);
	  $('html, body').stop().animate({scrollTop: $(anchor.attr('href')).offset().top}, 1000);
    $('a[href*=#]').removeClass('active');
    $(anchor).addClass('active');

    e.preventDefault();
	});

  //плавающий блок how it work
  $(function(){
    $(window).scroll(function() {

      s_top = $("body").scrollTop(); // определяем текущее положение скролла
      howWork = $("#how-work").offset().top;
      download = $("#download").offset().top;
      page_h = $("html").height();
      page_w = $('body').width(); 

      item_1 = $('.article-text-wrapper .item-1').offset().top;
      item_2 = $('.article-text-wrapper .item-2').offset().top;
      item_3 = $('.article-text-wrapper .item-3').offset().top;
      item_4 = $('.article-text-wrapper .item-4').offset().top;
      item_5 = $('.article-text-wrapper .item-5').offset().top;

      if(s_top > howWork+120 && s_top < download - page_h+190){
        $("#how-work .device").removeClass('abs').addClass('fixed').css('top', '140px');
      } else {
        $("#how-work .device").removeClass('fixed').addClass('abs').css('top', '298px');
      }
      if(s_top > download - page_h+190){
        $("#how-work .device").removeClass('fixed').addClass('abs').css('top', 'auto').css('bottom', '0px');
      }


      $('.article-device-wrapper .device .item-1').show();


      if (page_w > 765) {
        // определяем в какую сторону скроллят страницу
        if(s_top > s_start){ // down
          if(s_top > item_1-140 && s_top < item_2-140){
            $('html, body').stop().scrollTop(item_2-140);
            $('.article-device-wrapper .device .screen').hide();
            $('.article-device-wrapper .device .item-2').show();
          }
          if(s_top > item_2-140 && s_top < item_3-140){
            $('html, body').stop().scrollTop(item_3-140);
            $('.article-device-wrapper .device .screen').hide();
            $('.article-device-wrapper .device .item-3').show();
          }
          if(s_top > item_3-140 && s_top < item_4-140){
            $('html, body').stop().scrollTop(item_4-140);
            $('.article-device-wrapper .device .screen').hide();
            $('.article-device-wrapper .device .item-4').show();
          }
          if(s_top > item_4-140 && s_top < item_5-140){
            $('html, body').stop().scrollTop(item_5-140);
            $('.article-device-wrapper .device .screen').hide();
            $('.article-device-wrapper .device .item-5').show();
          }
          if(s_top > item_5-140 && s_top < download){
            $('html, body').stop().scrollTop(download);
            // $('.article-device-wrapper .device .item').hide();
          }

        } else{ // up
          if(s_top > item_5-140 && s_top <= download){
            $('html, body').stop().scrollTop(item_5-139);
            $('.article-device-wrapper .device .screen').hide();
            $('.article-device-wrapper .device .item-5').show();
          }
          if(s_top > item_4-140 && s_top <= item_5-140){
            $('html, body').stop().scrollTop(item_4-139);
            $('.article-device-wrapper .device .screen').hide();
            $('.article-device-wrapper .device .item-4').show();
          }
          if(s_top > item_3-140 && s_top <= item_4-140){
            $('html, body').stop().scrollTop(item_3-139);
            $('.article-device-wrapper .device .screen').hide();
            $('.article-device-wrapper .device .item-3').show();
          }
          if(s_top > item_2-140 && s_top <= item_3-140){
            $('html, body').stop().scrollTop(item_2-139);
            $('.article-device-wrapper .device .screen').hide();
            $('.article-device-wrapper .device .item-2').show();
          }
          if(s_top > item_1-140 && s_top <= item_2-140){
            $('html, body').stop().scrollTop(item_1-139);
            $('.article-device-wrapper .device .screen').hide();
            $('.article-device-wrapper .device .item-1').show();
          }
        }
        s_start = s_top;
      }

      

      HomePageScroll();

      if (s_top > 190){
        $('header .header').slideUp();
      } else {
        $('header .header').slideDown();  
      }


      $('header').mouseover(function(){
        if (s_top > 190){
          $('header .header').stop().slideDown();
        }
      });       
      $('header').mouseout(function(){
        if (s_top > 190){
          $('header .header').stop().slideUp();
        }
      });

    });
  });


  setInterval(ImgHeight, 500); 

	return false;

});

function HowWorkBlock(event){

}


function HomePageScroll(event) { 
  var hash = [ 'home', 'whatsIt', 'how-work', 'download', 'contact'];
  var offsets = [ $('#home').offset().top,
                  $('#whatsIt').offset().top,
                  $('#how-work').offset().top,
                  $('#download').offset().top, 
                  $('#contact').offset().top ];
  offsets.push($(document).height());
  var docScroll = $(document).scrollTop() + $(window).height() / 2;
  for (var i = 0; i < offsets.length - 1; i++) {
    if (docScroll >= offsets[i] && docScroll < offsets[i + 1]) {
      $('header a').removeClass('active');
      $('a[href*=#'+hash[i]+']').addClass('active');
      break;
    }
  }
}

function ImgHeight(e){
  var item_h = $('.device img').height();
  // console.log(item_h);
  // $('.article-text-wrapper .item, .article-text-wrapper, .article-content').css('height', item_h+'px');
  $('.article-text-wrapper .item').css('height', item_h+'px');
}