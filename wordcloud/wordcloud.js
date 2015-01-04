// wordcloud.js
//	by David Wilson
//
//	An interactive Word Cloud.

// function wordcloud(svg_id,h,w,font_family,num_bars,alldata,colorRanges,names,quantifications,colors,highlight_colors,rect_transition_time,total_rect_transition) {
function wordcloud(svg_id,h,w,font_family,data){
	// Find the SVG and set height and width
	var choreosvg = d3.select(svg_id);
	choreosvg.attr("width",w).attr("height",h);


	function rgbArrayToString(rgb) {
		return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
	}


	// var words = data.nodes;
	// var edges = data.edges;

	// var texts = choreosvg.selectAll("text")
	// 		.data(words)
	// 		.enter()
	// 		.append("text")
	// 		.text(function(d) {
	// 			return d.word;
	// 		})
	// 		.attr({
	// 			x: function(d) { return Math.random()*(w-20)+10;},
	// 			y: function(d) { return Math.random()*(h-20)+10;},
	// 			"font-family": font_family,
	// 			"font-size": function(d) {return (11+5*parseInt(d.count))+"px";},
	// 			fill: "black",
	// 			"text-anchor": "middle"
	// 		});

	var force = d3.layout.force()
		.nodes(data.nodes)
		.links(data.edges)
		.size([w,h])
		.linkDistance([85])
		.charge([-300])
		.start();

	var edges = choreosvg.selectAll("line")
		.data(data.edges)
		.enter()
		.append("line")
		.style("stroke","#ccc")
		.style("stroke-width","1.5px");

	var nodes = choreosvg
		.selectAll("ellipse")
		.data(data.nodes)
		.enter()
		.append("ellipse")
		.attr("rx", function(d) {return 32;})
		.attr("ry", function(d) {return 15;})
		.attr("fill",function(d) { return "rgb("+ (220+d.count*5) + ",0,0)"; })
		.call(force.drag);

	var words = choreosvg.selectAll("text")
		.data(data.nodes)
		.enter()
		.append("text")
		.text(function(d) { return d.word; })	
		.style("fill","black")
		.style("font-size","10px")
		.attr("text-anchor", "middle")
		.call(force.drag);

	force.on("tick", function() {

		edges.attr("x1", function(d) { return d.source.x; })
			 .attr("y1", function(d) { return d.source.y; })
			 .attr("x2", function(d) { return d.target.x; })
			 .attr("y2", function(d) { return d.target.y; });

		nodes.attr("cx", function(d) { return d.x; })
		     .attr("cy", function(d) { return d.y; });
		words.attr("x", function(d) { return d.x; })
		     .attr("y", function(d) { return d.y+4; }); // +4 to compensate for font-size
	});

};

// Adjust size with frequency
// Avoid overlapping
// Remove duplicates