var dsv = d3.dsv("|","text/plain");
dsv("../data/pieces.csv", function(error,dataPiece) {
	if (error) {
		console.log(error);
		return
	}

	var names = dataPiece.map(function(d){
		return d.piece;
	});
	console.log(names);

	var words = names.join(" ").split(" ");
	console.log(words);

	var svg_id = "#svgWordCloud";
	var h = 500;
	var w = 1000;
	var font_family = 'GulimFontFamily';

			// Call wordcloud
		 wordcloud(svg_id,
		 		  h,
		 		  w,
		 		  font_family,
		// 		  num_bars,
		 		  words);
		// 		  colorRanges,
		// 		  names,
		// 		  quantifications,
		// 		  colors,
		// 		  highlight_colors,
		// 		  rect_transition_time,
		// 		  total_rect_transition);


});