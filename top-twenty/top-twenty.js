// Top-Twenty
//	by David Wilson
//
//	An interactive "Top 20" list that allows you to change data sets and number of displayed
//  values. Each bar shows the value and is colored according to the value. Hovering over a 
//  a bar shows further information about the data.
//
// Inspired by "Interactive Data Visualization for the Web" by Scott Murray (O'Reilly)

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
				var current_num_bars = 3;

				var choreodata = dataChoreo.map(function(o){
					return [o.choreographer,parseInt(o.count)];
				});
				var piecedata = dataPiece.map(function(o){
					return [o.piece,parseInt(o.count)];
				})

				var thischoreodata = choreodata.slice(0,num_bars[current_num_bars]);
				var thispiecedata = piecedata.slice(0,num_bars[current_num_bars]);
				var blankchoreodata = [];
				var blankpiecedata = [];
				for (var i = 0; i < thischoreodata.length; i++) { blankchoreodata.push([0,0])};
				for (var i = 0; i < thispiecedata.length; i++) { blankpiecedata.push([0,0])};

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
				var blankdata = [blankchoreodata,blankpiecedata];
				var max_data = [max_data_choreo,max_data_pieces];
				var min_data = [min_data_choreo,min_data_pieces];
				var yScales = [yScaleChoreo,yScalePiece];
				var xOrdinalScales = [xOrdinalScaleChoreo,xOrdinalScalePiece];
				var colorScales = [colorScaleChoreo,colorScalePiece];
				var colorRanges = [[[0,50,50],[20,250,250]],[[50,25,0],[250,50,0]]];
				var names = ["Choreographers", "Ballets"];
				var quantifications = ["pieces", "performances"];
				var colors = [[0,0,128],[128,0,0]];
				var highlight_color = [255,165,0];
				var rect_transition_time = 250;
				var total_rect_transition = 750;

				var rects;
				var texts;
				var titletext;
				var infodetails;

				function removeAllRectsAndText() {
					choreosvg.selectAll("*").remove();
				}

				function colorRects(color1,color2,yValue,yMaxValue) {

					var scaleR = d3.scale.sqrt()
					.domain([0,yMaxValue])
					.rangeRound([color1[0],color2[0]]);
					var scaleG = d3.scale.sqrt()
					.domain([0,yMaxValue])
					.rangeRound([color1[1],color2[1]]);
					var scaleB = d3.scale.sqrt()
					.domain([0,yMaxValue])
					.rangeRound([color1[2],color2[2]]);

					return  rgbArrayToString([scaleR(yValue),scaleG(yValue),scaleB(yValue)]);
				}

				function colorCurrentRects(yValue) {
					return colorRects(colorRanges[current_data][0],
						colorRanges[current_data][1],
						yValue,
						max_data[current_data]);
				}

				function rgbArrayToString(rgb) {
					return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
				}

				function updateBars() {
					choreosvg.selectAll("rect")
					.data(thisdata[current_data])
					.transition()
					.delay(function(d,i){return i*total_rect_transition/thisdata[current_data].length;})
					.duration(rect_transition_time)
					.attr("y",function(d){
						return h-yScales[current_data](d[1]);
					})
					.attr("height",function(d){
						return yScales[current_data](d[1]);
					})
					.attr("fill", function(d) {
						return colorCurrentRects(d[1]); 
						});

					choreosvg.selectAll("text")
					.data(thisdata[current_data])
					.transition()
					.delay(function(d,i){return i*total_rect_transition/thisdata[current_data].length;})
					.duration(rect_transition_time)
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
					.delay(rect_transition_time)
					.duration(rect_transition_time)
					.attr("fill", rgbArrayToString(colors[current_data]));
					titletext[1].transition()
					.delay(rect_transition_time)
					.duration(rect_transition_time)
					.text(thisdata[current_data].length)
					.attr("fill", rgbArrayToString(colors[current_data]));
					titletext[2].transition()
					.delay(rect_transition_time)
					.duration(rect_transition_time)
					.text(" " + names[current_data])
					.attr("fill", rgbArrayToString(colors[current_data]));

				}

				function createBars() {

					rects = choreosvg.selectAll("rect")
						.data(blankdata[current_data])
						.enter()
						.append("rect")
						.attr({
							x: function(d,i) { return xOrdinalScales[current_data](i);},
							y: h,
							width: xOrdinalScales[current_data].rangeBand(),
							height:0,
							fill: "white"
						});

					texts = choreosvg.selectAll("text")
						.data(blankdata[current_data])
						.enter()
						.append("text")
						.text(function(d) {
							return d[1];
						})
						.attr({
							x: function(d,i) { return xOrdinalScales[current_data](i)+xOrdinalScales[current_data].rangeBand() / 2;},
							y: h,
							"font-family": font_family,
							"font-size": "11px",
							fill: "white",
							"text-anchor": "middle"
						});

					titletext = [0,0,0];

					titletext[0] = choreosvg.append("text")
						.text("Top ")
						.attr({
							x: w-400,
							y: 50,
							"font-family": font_family,
							"font-size": "30px",
							fill: rgbArrayToString(colors[current_data])
						});
					titletext[1] = choreosvg.append("text")
						.text(thisdata[current_data].length)
						.attr({
							x: w-340,
							y: 50,
							"font-family": font_family,
							"font-size": "30px",
							"text-decoration": "underline",
							fill: rgbArrayToString(colors[current_data])
						});
					titletext[2] = choreosvg.append("text")
						.text(" " + names[current_data])
						.attr({
							x: w-300,
							y: 50,
							"font-family": font_family,
							"text-decoration": "underline",
							"font-size": "30px",
							fill: rgbArrayToString(colors[current_data])
						});

					infodetails = choreosvg.append("text")
						.text("")
						.attr({
							x: w-400,
							y: 85,
							width: "350px",
							"font-family": font_family,
							"font-size": "20px",
							fill: rgbArrayToString(colors[current_data])
						});

					// populate data
					updateBars();

					//Click to change number of entries
					titletext[1].on("click", function() {
						current_num_bars += 1;
						current_num_bars %= num_bars.length;

						//Update data values
						for (var i = 0; i < thisdata.length; i++) {
							thisdata[i] = alldata[i].slice(0,num_bars[current_num_bars]);
							blankdata[i] = [];
							for (var j = 0; j < thisdata[i].length; j++) { blankdata[i].push([0,0])};
							max_data[i] = d3.max(thisdata[i], function(d){return d[1];});
							min_data[i] = d3.min(thisdata[i], function(d){return d[1];});
							yScales[i].domain([0,max_data[i]]);
							xOrdinalScales[i].domain(d3.range(thisdata[i].length));
							colorScales[i].domain([0,max_data[i]]);
						};

						removeAllRectsAndText();

						createBars();
					});
					// End of on click for titletext[1]

					//Click on type to change type of top 20
					titletext[2].on("click", function() {

						current_data += 1;
						current_data %= thisdata.length;

						updateBars();
					}); 
					// end of on click for titletext[2]


					// Hover over bar to highlight and show info
					choreosvg.selectAll("rect").on("mouseover", function(d) {
						d3.select(this)
						.attr("fill",rgbArrayToString(highlight_color));

						var xPosition = parseFloat(d3.select(this).attr("x")) + xOrdinalScales[current_data].rangeBand()/2;
						var yPosition = parseFloat(d3.select(this).attr("y"))/2 + h/2;

						infodetails.transition()
						.duration(50)
						.text(function(){
							return d[0] + ": " + d[1] + " " + quantifications[current_data];
						})
						.attr("fill",function(){
							return rgbArrayToString(colors[current_data]);
						});

						infodetails.classed("hidden", false);

					}); 
					// end of mouseover for bars

					//Leave rectangle
					choreosvg.selectAll("rect").on("mouseout", function(d) {
						d3.select(this)
						.transition()
						.duration(250)
						.attr("fill", colorCurrentRects(d[1]));
						infodetails.classed("hidden",true);
					}); 
					//end of mouseout for bars

				}
				// end of create vbars

				//create bars
				createBars();

			} 
			//end of inner else
		}); 
		// end of dsv function
	} 
	// end of outer else
}); 
// end of csv function

