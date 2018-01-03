jQuery(document).ready(function($){  

	$("#price-range").slider({
		range: true,
		min: 0,
		max: 3000,
		values: [ 500, 2000 ],
		slide: function( event, ui ) {
			$( "#from-price" ).val(ui.values[ 0 ]);
			$( "#to-price" ).val(ui.values[ 1 ]);
		}
	});
	$( "#from-price" ).val( $( "#price-range" ).slider( "values", 0 ));
	$( "#to-price" ).val( $( "#price-range" ).slider( "values", 1 ) );

}); 
