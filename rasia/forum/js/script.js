$(document).ready(function(){
  $('#logos-1 .bxslider').bxSlider({
  	pager:false,
  	slideWidth: 170,
    minSlides: 2,
    maxSlides: 5,    
    moveSlides: 1,
    slideMargin: 30
  });
  $('#tv .bxslider').bxSlider({
  	pager:false,
  	slideWidth: 300,
    minSlides: 1,
    maxSlides: 3,    
    moveSlides: 1,
    slideMargin: 30
  });

  $(function() {
    $( ".datepicker" ).datepicker();
  });

});