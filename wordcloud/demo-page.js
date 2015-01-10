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

	var words_array = [];
	for (var i = 0; i < dataWords.length; i++){
		words_array.push({word: dataWords[i].word, count: parseInt(dataWords[i].count)});
	}
	var edges_array = [];
	for (var i = 0; i < dataEdges.length; i++){
		edges_array.push({source: parseInt(dataEdges[i].source), target: parseInt(dataEdges[i].target)});
	}

	var dataset = { nodes: words_array, edges: edges_array};

	var svg_id = "#svgWordCloud";
	var h = 1000;
	var w = 1000;
	var font_family = 'GulimFontFamily';
	var colorRange = [];

		// Call wordcloud
		 wordcloud(svg_id,
		 		  h,
		 		  w,
		 		  font_family,
		 		  dataset);



});
});