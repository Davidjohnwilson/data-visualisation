d3.csv("../data/choreos.csv", function(error,dataChoreo) {
	if (error) {
		console.log(error);
	} else {
		var dsv = d3.dsv("|","text/plain");
		dsv("../data/pieces.csv", function(error,dataPiece) {
			if (error) {
				console.log(error);
			} else {
				var svg_id = "#svgPieceChoreo";
				var choreosvg = d3.select(svg_id);
				//set height and width
				var h = 500;
				var w = 1000;
				choreosvg.attr("width",w).attr("height",h);

				var font_family = 'GulimFontFamily';
				var num_bars = [5,10,20,50];
				var current_num_bars = 2;

				var choreodata = dataChoreo.map(function(o){
					return [o.choreographer,parseInt(o.count)];
				});
				var piecedata = dataPiece.map(function(o){
					return [o.piece,parseInt(o.count)];
				})

				var thischoreodata = choreodata.slice(0,num_bars[current_num_bars]);
				var thispiecedata = piecedata.slice(0,num_bars[current_num_bars]);

				var max_data_choreo = d3.max(thischoreodata, function(d){return d[1];});
				var min_data_choreo = d3.min(thischoreodata, function(d){return d[1];});
				var yScaleChoreo = d3.scale.linear()
				.domain([0,max_data_choreo])
				.range ([0,h]);
				var xOrdinalScaleChoreo = d3.scale.ordinal()
				.domain(d3.range(thischoreodata.length))
				.rangeRoundBands([0,w],0.05);
				var colorScaleChoreo = d3.scale.sqrt()
				.domain([0,max_data_choreo])
				.rangeRound([50,200]);

				var max_data_pieces = d3.max(thispiecedata, function(d){return d[1];});
				var min_data_pieces = d3.min(thispiecedata, function(d){return d[1];});
				var yScalePiece = d3.scale.linear()
				.domain([0,max_data_pieces])
				.range ([0,h]);
				var xOrdinalScalePiece = d3.scale.ordinal()
				.domain(d3.range(thispiecedata.length))
				.rangeRoundBands([0,w],0.05);
				var colorScalePiece = d3.scale.sqrt()
				.domain([0,max_data_pieces])
				.rangeRound([50,200]);


				//Set up combined data sources
				var current_data = 0;
				var alldata = [choreodata,piecedata];
				var thisdata = [thischoreodata,thispiecedata];
				var max_data = [max_data_choreo,max_data_pieces];
				var min_data = [min_data_choreo,min_data_pieces];
				var yScales = [yScaleChoreo,yScalePiece];
				var xOrdinalScales = [xOrdinalScaleChoreo,xOrdinalScalePiece];
				var colorScales = [colorScaleChoreo,colorScalePiece];
				var names = ["Choreographers", "Ballets"];
				var quantifications = ["pieces", "performances"];
				var colors = ["navy","maroon"];

				var rects = choreosvg.selectAll("rect")
				.data(thisdata[current_data])
				.enter()
				.append("rect")
				.attr({
					x: function(d,i) { return xOrdinalScales[current_data](i);},
					y: function(d) { return h - yScales[current_data](d[1]);},
					width: xOrdinalScales[current_data].rangeBand(),
					height: function(d) { return yScales[current_data](d[1]); },
					fill: function(d) { return  "rgb(0, 0, " + colorScales[current_data](d[1]) + ")";}
				});

				var texts = choreosvg.selectAll("text")
				.data(thisdata[current_data])
				.enter()
				.append("text")
				.text(function(d) {
					return d[1];
				})
				.attr({
					x: function(d,i) { return xOrdinalScales[current_data](i)+xOrdinalScales[current_data].rangeBand() / 2;},
					y: function(d) { return h - yScales[current_data](d[1])+14; },
					"font-family": font_family,
					"font-size": "11px",
					fill: "white",
					"text-anchor": "middle"
				});

				var titletext = [0,0,0];

				titletext[0] = choreosvg.append("text")
				.text("Top ")
				.attr({
					x: w-400,
					y: 50,
					"font-family": font_family,
					"font-size": "30px",
					fill: colors[current_data]
				});
				titletext[1] = choreosvg.append("text")
				.text(thisdata[current_data].length)
				.attr({
					x: w-340,
					y: 50,
					"font-family": font_family,
					"font-size": "30px",
					"text-decoration": "underline",
					fill: colors[current_data]
				});
				titletext[2] = choreosvg.append("text")
				.text(" " + names[current_data])
				.attr({
					x: w-300,
					y: 50,
					"font-family": font_family,
					"text-decoration": "underline",
					"font-size": "30px",
					fill: colors[current_data]
				});

				var infodetails = choreosvg.append("text")
				.text("")
				.attr({
					x: w-400,
					y: 85,
					width: "350px",
					"font-family": font_family,
					"font-size": "20px",
					fill: colors[current_data]				
				});


				titletext[1].on("click", function() {
					current_num_bars += 1;
					current_num_bars %= num_bars.length;

					// Need to update:
					// thisdata
					// max_data
					// min_data
					// yScales
					// xOrdinalScales
					// colorScales

					for (var i = 0; i < thisdata.length; i++) {
						thisdata[i] = alldata[i].slice(0,num_bars[current_num_bars]);
						max_data[i] = d3.max(thisdata[i], function(d){return d[1];});
						min_data[i] = d3.min(thisdata[i], function(d){return d[1];});
						yScales[i].domain([0,max_data[i]]);
						xOrdinalScales[i].domain(d3.range(thisdata[i].length));
						colorScales[i].domain([0,max_data[i]]);
					};

					choreosvg.selectAll("rect").data(thisdata[current_data])


					// Then remove
					// rects 
					// text

					removeAllRectsAndText(choreosvg);


					// Then add
					// rects 
					// text
					rects = choreosvg.selectAll("rect")
					.data(thisdata[current_data])
					.enter()
					.append("rect")
					.attr({
						x: function(d,i) { return xOrdinalScales[current_data](i);},
						y: function(d) { return h - yScales[current_data](d[1]);},
						width: xOrdinalScales[current_data].rangeBand(),
						height: function(d) { return yScales[current_data](d[1]); },
						fill: function(d) { return  "rgb(0, 0, " + colorScales[current_data](d[1]) + ")";}
					});

					texts = choreosvg.selectAll("text")
					.data(thisdata[current_data])
					.enter()
					.append("text")
					.text(function(d) {
						return d[1];
					})
					.attr({
						x: function(d,i) { return xOrdinalScales[current_data](i)+xOrdinalScales[current_data].rangeBand() / 2;},
						y: function(d) { return h - yScales[current_data](d[1])+14; },
						"font-family": font_family,
						"font-size": "11px",
						fill: "white",
						"text-anchor": "middle"
					});




					titletext[1].transition()
					.delay(250)
					.duration(250)
					.text(num_bars[current_num_bars])
					.attr("fill", colors[current_data]);
				});
				// End of on click for titletext[1]



				titletext[2].on("click", function() {

					current_data += 1;
					current_data %= thisdata.length;
					
					choreosvg.selectAll("rect")
					.data(thisdata[current_data])
					.transition()
					.delay(function(d,i){return i*50;})
					.duration(250)
					.attr("y",function(d){
						return h-yScales[current_data](d[1]);
					})
					.attr("height",function(d){
						return yScales[current_data](d[1]);
					})
					.attr("fill", function(d) {
						if (current_data == 0) {
							return "rgb(0,0," + colorScales[current_data](d[1]) + ")";
						} else {
							return "rgb(" + colorScales[current_data](d[1]) + ",0,0)";
						}
					});

					choreosvg.selectAll("text")
					.data(thisdata[current_data])
					.transition()
					.delay(function(d,i){return i*50;})
					.duration(250)
					.text(function(d) {
						return d[1];
					})
					.attr("x", function(d,i) {
						return xOrdinalScales[current_data](i) + xOrdinalScales[current_data].rangeBand()/2;
					})
					.attr("y", function(d) {
						return h - yScales[current_data](d[1])+14;
					});


					titletext[0].transition()
					.delay(250)
					.duration(250)
					.attr("fill", colors[current_data]);
					titletext[1].transition()
					.delay(250)
					.duration(250)
					.text(thisdata[current_data].length)
					.attr("fill", colors[current_data]);
					titletext[2].transition()
					.delay(250)
					.duration(250)
					.text(" " + names[current_data])
					.attr("fill", colors[current_data]);



				}); 
				// end of on click for titletext[2]

				choreosvg.selectAll("rect").on("mouseover", function(d) {
					d3.select(this)
					.attr("fill","orange");

					var xPosition = parseFloat(d3.select(this).attr("x")) + xOrdinalScales[current_data].rangeBand()/2;
					var yPosition = parseFloat(d3.select(this).attr("y"))/2 + h/2;

					infodetails.transition()
					.duration(50)
					.text(function(){
						return d[0] + ": " + d[1] + " " + quantifications[current_data];
					})
					.attr("fill",function(){
						return colors[current_data];
					});

					infodetails.classed("hidden", false);


				}); 
					// end of mouseover for bars

					choreosvg.selectAll("rect").on("mouseout", function(d) {
						d3.select(this)
						.transition()
						.duration(250)
						.attr("fill", function(){
							if (current_data == 0) {
								return "rgb(0,0," + colorScales[current_data](d[1]) + ")";
							} else {
								return "rgb(" + colorScales[current_data](d[1]) + ",0,0)";
							}
						});
						infodetails.classed("hidden",true);
					}); 
					 //end of mouseout for bars


					} 
			//end of inner else
		}); 
		// end of dsv function
	} 
	// end of outer else
}); 
// end of csv function

function removeAllRectsAndText(svg) {
					svg.selectAll("rect")
					.transition()
					.duration(500)
					// .attr("x",w)
					.remove();

					svg.selectAll("text")
					.transition()
					.duration(500)
					.remove();
}
