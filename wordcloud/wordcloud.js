// wordcloud.js
//	by David Wilson
//
//	An interactive Word Cloud.

// function wordcloud(svg_id,h,w,font_family,num_bars,alldata,colorRanges,names,quantifications,colors,highlight_colors,rect_transition_time,total_rect_transition) {
function wordcloud(svg_id,h,w,font_family,words){
	// Find the SVG and set height and width
	var choreosvg = d3.select(svg_id);
	choreosvg.attr("width",w).attr("height",h);

	texts = choreosvg.selectAll("text")
			.data(words)
			.enter()
			.append("text")
			.text(function(d) {
				return d;
			})
			.attr({
				x: function(d) { return Math.random()*w;},
				y: function(d) { return Math.random()*h;},
				"font-family": font_family,
				"font-size": "11px",
				fill: "black",
				"text-anchor": "middle"
			});


};

// Adjust size with frequency
// Avoid overlapping
// Remove duplicates
// Remove punctuation