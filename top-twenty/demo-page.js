// SAMPLE USAGE OF TOPTWENTY

// Load in CSV
d3.csv("../data/choreos.csv", function(error,dataChoreo) {
	if (error) {
		console.log(error);
		return
	}

	// Load in DSV
	var dsv = d3.dsv("|","text/plain");
	dsv("../data/pieces.csv", function(error,dataPiece) {
		if (error) {
			console.log(error);
			return
		}

		//Extract data into form [name,count]
		var choreodata = dataChoreo.map(function(o){
			return [o.choreographer,parseInt(o.count)];
		});
		var piecedata = dataPiece.map(function(o){
			return [o.piece,parseInt(o.count)];
		})
		var alldata = [choreodata,piecedata];

		// Set other parameters
		var svg_id = "#svgPieceChoreo";
		var h = 500;
		var w = 1000;
		var font_family = 'GulimFontFamily';
		var num_bars = [20,25,50,5,10];
		var colorRanges = [[[10,50,100],[0,165,255]],[[150,35,0],[250,25,0]]];
		var names = ["Choreographers", "Ballets"];
		var quantifications = ["pieces", "performances"];
		var colors = [[0,0,128],[128,0,0]];
		var highlight_colors = [[0,200,255],[255,165,0]];
		var rect_transition_time = 250;
		var total_rect_transition = 750;

		// Call toptwenty
		toptwenty(svg_id,
				  h,
				  w,
				  font_family,
				  num_bars,
				  alldata,
				  colorRanges,
				  names,
				  quantifications,
				  colors,
				  highlight_colors,
				  rect_transition_time,
				  total_rect_transition);

	}); // end of dsv function

}); // end of csv function