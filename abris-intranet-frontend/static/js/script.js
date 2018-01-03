function wrapperScript () {
jQuery(document).ready(function(){

	// var wrapper_h = $(window).height() - 80 - 54; // height header and height footer (paddings)
	// $("#main").css('min-height', wrapper_h + "px");

	// $( window ).resize(function() {
	//   var wrapper_h = $(window).height() - 80 - 54; // height header and height footer (paddings)
	// 	$("#main").css('min-height', wrapper_h + "px");
	// });

	$(".nano").nanoScroller({ preventPageScrolling: true });

	$('.widget-favor .panel-heading').bind('click', function(){
		$(this).parent().find('.panel-body').toggleClass('hide');
	});
});
}

// onload
function widget_favor_img_w_h(){
  $(".widget-favor img").each(function (i) {
    var rel_w_x_h = 1; 
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
}

//onload
function lenta_img_w_h(){
    $(".views-info img").each(function (i) {
        var rel_w_x_h = 270 / 199; 
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
}
