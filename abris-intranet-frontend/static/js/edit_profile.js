function profileEditScript () {
	
$(document).ready(function(){

	$(".onoffswitch-checkbox").bind("click", function(){
		if ($(this).is(':checked')) {
			$(this).parent().prev().removeClass("no-checked");
		} else {
			$(this).parent().prev().addClass("no-checked");
		}
	});

  $("#dateStart, #dateBirthday").datepicker({
  	changeMonth:true,
  	changeYear:true,
  	dateFormat: "dd.mm.yy",
  	yearRange: "1930:2015"
  });
  

});
	
}