function mediaPageScript () {
	console.log('mediaPageScript');
	jQuery(document).ready(function(){

		// var $grid = $('.grid').imagesLoaded( function() {
		//   // init Isotope after all images have loaded
		//   $grid.isotope({
		// 	  // set itemSelector so .grid-sizer is not used in layout
		// 	  itemSelector: '.grid-item',
		// 	  // layoutMode: 'masonry',
		// 	  masonry: {
		// 	    // use element for option
		// 	    columnWidth: '.grid-sizer',
		// 	    gutter: 23
		// 	  }
		// 	});
		// });

		// $('#arcticmodal-1').arcticmodal();


		$(".album img").each(function (i) {
      var rel_w_x_h = 248 / 149;
  		// удаляем атрибуты width и height
	    $(this).removeAttr("width")
	           .removeAttr("height")
	           .css({ width: "", height: "" });

	    // получаем заветные цифры
	    var img_w  = $(this).width();
	    var img_h = $(this).height();
      if(img_w / img_h > rel_w_x_h || img_w / img_h == rel_w_x_h){
      	$(this).css({height: "100%", width: "auto"});
      } else {
      	$(this).css({width: "100%", height: "auto"});
      }
      // console.log(rel_w_x_h);
      // console.log(img_w / img_h);
    });

    $(".grid-item img").each(function (i) {
      var rel_w_x_h = 251 / 171;
  		// удаляем атрибуты width и height
	    $(this).removeAttr("width")
	           .removeAttr("height")
	           .css({ width: "", height: "" });

	    // получаем заветные цифры
	    var img_w  = $(this).width();
	    var img_h = $(this).height();
      if(img_w / img_h > rel_w_x_h || img_w / img_h == rel_w_x_h){
      	$(this).css({height: "100%", width: "auto"});
      } else {
      	$(this).css({width: "100%", height: "auto"});
      }
      // console.log(rel_w_x_h);
      // console.log(img_w / img_h);
    });
    $(".grid-item.grid-item--width2 img").each(function (i) {
      var rel_w_x_h = 528 / 364;
  		// удаляем атрибуты width и height
	    $(this).removeAttr("width")
	           .removeAttr("height")
	           .css({ width: "", height: "" });

	    // получаем заветные цифры
	    var img_w  = $(this).width();
	    var img_h = $(this).height();
      if(img_w / img_h > rel_w_x_h || img_w / img_h == rel_w_x_h){
      	$(this).css({height: "100%", width: "auto"});
      } else {
      	$(this).css({width: "100%", height: "auto"});
      }
      // console.log(rel_w_x_h);
      // console.log(img_w / img_h);
    });



});}
