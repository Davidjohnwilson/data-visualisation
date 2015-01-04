// var dsv = d3.dsv("|","text/plain");
// dsv("../data/pieces.csv", function(error,dataPiece) {
d3.csv("../data/wordslist.csv", function(error,dataWords) {
	if (error) {
		console.log(error);
		return
	}
	d3.csv("../data/edgelist.csv", function(error,dataEdges){
		if (error) {
			console.log(error);
			return
		}

	var words = dataWords;
	var edges = dataEdges;

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
		 		  words,
		 		  edges);
		// 		  colorRanges,
		// 		  names,
		// 		  quantifications,
		// 		  colors,
		// 		  highlight_colors,
		// 		  rect_transition_time,
		// 		  total_rect_transition);


});
});