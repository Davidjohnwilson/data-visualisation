// wordcloud.js
//	by David Wilson
//
//	An interactive Word Cloud.

// function wordcloud(svg_id,h,w,font_family,num_bars,alldata,colorRanges,names,quantifications,colors,highlight_colors,rect_transition_time,total_rect_transition) {
function wordcloud(svg_id,h,w,font_family,words,edges){
	// Find the SVG and set height and width
	var choreosvg = d3.select(svg_id);
	choreosvg.attr("width",w).attr("height",h);

	var texts = choreosvg.selectAll("text")
			.data(words)
			.enter()
			.append("text")
			.text(function(d) {
				return d.word;
			})
			.attr({
				x: function(d) { return Math.random()*(w-20)+10;},
				y: function(d) { return Math.random()*(h-20)+10;},
				"font-family": font_family,
				"font-size": function(d) {return (11+5*parseInt(d.count))+"px";},
				fill: "black",
				"text-anchor": "middle"
			});

	// var force = d3.layout.force()
	// 	.nodes(words)
	// 	.links(edges)
	// 	.size([w,h])
	// 	.linkDistance([50])
	// 	.charge([-100])
	// 	.start();

	// var edges = choreosvg.selectAll("line")
	// 	.data(edges)
	// 	.enter()
	// 	.append("line")
	// 	.style("stroke","#ccc")
	// 	.style("stroke-width",1);

	// var nodes = choreosvg.selectAll("circle")
	// 	.data(words)
	// 	.enter()
	// 	.append("circle")
	// 	.attr("r",10)
	// 	.style("fill","red")
	// 	.call(force.drag);

};

// Adjust size with frequency
// Avoid overlapping
// Remove duplicates