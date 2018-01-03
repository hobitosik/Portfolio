$(document).ready(function(){
  $('#logos-1 .bxslider').bxSlider({
  	pager:false,
  	slideWidth: 170,
    minSlides: 2,
    maxSlides: 10,    
    moveSlides: 1,
    slideMargin: 30
  });
  $('#tv .bxslider').bxSlider({
  	controls:false,
    auto:true,
  	slideWidth: 370,
    minSlides: 1,
    maxSlides: 5,    
    moveSlides: 1,
    slideMargin: 30
  });


});