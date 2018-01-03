function companyStructureScript () {

$(document).ready(function(){

	$('.item-partner, .item-children').popover({
		trigger: 'hover',
		// container: ".item-partner",
	});

	$('.children-block .slider').bxSlider({
		// slideWidth: 230,
		// maxSlides: 1,
		pager:false,
		// infiniteLoop:false,
		mode: 'fade',
		adaptiveHeight: true,
	});

	$('.partners-block .slider').bxSlider({
		slideWidth: 190,
		minSlides: 2,
		maxSlides: 4,
		moveSlides: 1,
		slideMargin: 13,
		pager:false,
		infiniteLoop:false,
	});

	var lineStructure_W = ($("div.line").length - 1)*155; 
	$(".lineStructure").css('width', lineStructure_W + "px");

});

}