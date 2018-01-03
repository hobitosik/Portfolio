jQuery(document).ready(function($){  
	if ($( "select" ).is('select')){
		$( "select" ).selectmenu();
	}

	// карусель избранное и рекомендуемое
	if ($( "div" ).is('#recomendation, #seeYou')){
		$('#recomendation .row , #seeYou .row ').bxSlider({
			// slideMargin: 20,
			// slideSelector: '.col-lg-3',
			pager: false,
			minSlides: 1,
			maxSlides: 4,
			moveSlides: 1,
			slideWidth: 295,
		});
	}
}); 
