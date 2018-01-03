function companyDetailScript() {
	

$(document).ready(function(){


	var lineStructure_W;
	var lineStructure_H;
	var last_line_W = undefined;
	var line_W;
	var view_W;
	var item_num;
	var line_num;

	CompanyDetLineDraw();

	$( window ).resize(function() {
	  CompanyDetLineDraw();
	});
	


});

function CompanyDetLineDraw(){

	view_W = $('#companyDetail .views-group').width();
	item_num = $('#companyDetail .view-item').length;

	line_W = view_W - 250 - 40; // 185 = width item, 40 - margin item

	// if (view_W < 397){
	// 	line_num = item_num;
	// }
	// if (view_W >= 397 && view_W < 597){
	// 	line_num = Math.ceil(item_num / 2);
	// 	if(line_num - item_num / 2 == 0.5){
	// 		last_line_W = 185/2;
	// 	} else {
	// 		last_line_W = line_W;
	// 	}
	// }
	// if (view_W >= 597 && view_W < 797){
		line_num = Math.ceil(item_num / 3);
		if(line_num - item_num / 3 == 0){
			last_line_W = line_W;
		} else if (line_num - item_num / 3 > 0.5){ 
			last_line_W = 250/2;
		} else{
			last_line_W = 250+10;
		}
	// }
	// if (view_W > 797){
	// 	line_num = Math.ceil(item_num / 4);
	// 	if(line_num - item_num / 4 == 0){
	// 		last_line_W = line_W;
	// 	} else if(line_num - item_num / 4 == 0.75 ){
	// 		last_line_W = 185/2;
	// 	} else if(line_num - item_num / 4 == 0.5){
	// 		last_line_W = 185+10;
	// 	} else {
	// 		last_line_W = 182*3/2+20;
	// 	}
	// }

	if ($('#companyDetail .line-h').length != line_num){

		$('#companyDetail .line-h').remove();
		for (var i = 1; i <= line_num; i++) {		 
			$('#companyDetail .lineStructure').append("<div class='line line-h'></div>");
		}
	}


	lineStructure_H = (line_num - 1) * 219 + 47; // 219 (219) height item, 47 height otrostok up
	$("#companyDetail .line-v").css('height', lineStructure_H + "px");
	$("#companyDetail .line-h").css('width', line_W + "px");
	$("#companyDetail .line.line-h:last-child").css('width', last_line_W + "px");
}

}