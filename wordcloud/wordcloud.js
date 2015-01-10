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
		.style("stroke-width","1.5px")
		.style("marker-end",  "url(#suit)") // Modified line 
;

	var nodes = choreosvg
		.selectAll("ellipse")
		.data(data.nodes)
		.enter()
		.append("ellipse")
		.attr("rx", function(d) {return 32;})
		.attr("ry", function(d) {return 15;})
		.attr("fill",function(d) { return "rgb("+ (220+d.count*5) + ",0,0)"; })
		.call(force.drag)
		.on("dblclick", allConnectedNodes); //Added code 


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

		nodes.each(collide(0.5));
	});

// The following features are taken or adapted from this Coppelia.io blog post: 
// http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/

// ADD ARROW HEADS
// Adds an arrow head halfway along each edge
choreosvg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 50)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
    .style("stroke", "#ccc")
    .style("opacity", "0.6");

// AVOID COLLISIONS
// Function to try and avoid collisions between circles
var padding = 1, // separation between circles
    radius=8;
function collide(alpha) {
  var quadtree = d3.geom.quadtree(data.nodes);
  return function(d) {
    var rb = 2*radius + padding,
        nx1 = d.x - rb,
        nx2 = d.x + rb,
        ny1 = d.y - rb,
        ny2 = d.y + rb;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y);
          if (l < rb) {
          l = (l - rb) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}


// DOUBLE CLICK TO HIGHLIGHT
// Adds double click connection highlighting
//Toggle stores whether the highlighting is on
var toggle = 0;
//Create an array logging what is connected to what
var linkedByIndex = {};
for (i = 0; i < data.nodes.length; i++) {
    linkedByIndex[i + "," + i] = 1;
};
data.edges.forEach(function (d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});
var connectedByIndex = linkedByIndex;
for (i=0; i < 1; i++) {
	for (j = 0; j < data.nodes.length; j++) {
		for (k = 0; k < data.nodes.length; k++) {
			for (l = 0; l < data.nodes.length; l++) {
				if (connectedByIndex[j+","+k] == 1 & connectedByIndex[k+","+l] == 1) {
					connectedByIndex[j+","+l]=1;
					connectedByIndex[l+","+j]=1;
				}
				if (connectedByIndex[l+","+k] == 1 & connectedByIndex[k+","+j] == 1) {
					connectedByIndex[j+","+l]=1;
					connectedByIndex[l+","+j]=1;
				}
			}
		}
	}
}
//This function looks up whether a pair are neighbours
function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
}

function connected(a,b) {
    return connectedByIndex[a.index + "," + b.index];
}

function connectedNodes() {
    if (toggle == 0) {
        //Reduce the opacity of all but the neighbouring nodes
        d = d3.select(this).node().__data__;
        nodes.style("opacity", function (o) {
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
        });
        edges.style("opacity", function (o) {
            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
        });
        //Reduce the op
        toggle = 1;
    } else {
        //Put them back to opacity=1
        nodes.style("opacity", 1);
        edges.style("opacity", 1);
        toggle = 0;
    }
}

function allConnectedNodes() {
    if (toggle == 0) {
        //Reduce the opacity of all but the neighbouring nodes
        d = d3.select(this).node().__data__;
        nodes.style("opacity", function (o) {
            return connected(d, o) | connected(o, d) ? 1 : 0.1;
        });
        edges.style("opacity", function (o) {
        	return connected(d,o.source) | connected(d,o.target) ? 1 : 0.1;
            // return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
        });
        //Reduce the op
        toggle = 1;
    } else {
        //Put them back to opacity=1
        nodes.style("opacity", 1);
        edges.style("opacity", 1);
        toggle = 0;
    }
}


};
