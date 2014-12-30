// Top-Twenty
//	by David Wilson
//
//	An interactive "Top 20" list that allows you to change data sets and number of displayed
//  values. Each bar shows the value and is colored according to the value. Hovering over a 
//  a bar shows further information about the data.
//
// Inspired by "Interactive Data Visualization for the Web" by Scott Murray (O'Reilly)


function toptwenty(svg_id,h,w,font_family,num_bars,alldata,colorRanges,names,quantifications,colors,highlight_colors,rect_transition_time,total_rect_transition) {

	// Find the SVG and set height and width
	var choreosvg = d3.select(svg_id);
	choreosvg.attr("width",w).attr("height",h);

	// We always start at the first entry of the num_bars
	var current_num_bars = 0; 

	// Set up the data and scales for the initial entry
	var thisdata = [];
	var blankdata = [];
	var max_data = [];
	var min_data = [];
	var yScales = [];
	var xOrdinalScales = [];

	for (var i = 0; i<alldata.length; i++) {
		thisdata.push(alldata[i].slice(0,num_bars[current_num_bars]));
		var individualblankdata = [];
		for (var j = 0; j < thisdata[i].length; j++) { individualblankdata.push([0,0])};
		blankdata.push(individualblankdata)

		max_data.push(d3.max(thisdata[i], function(d){return d[1];}));
		min_data.push(d3.min(thisdata[i], function(d){return d[1];}));
		yScales.push(d3.scale.linear()
			.domain([0,max_data[i]])
			.range ([0,h]));
		xOrdinalScales.push(d3.scale.ordinal()
			.domain(d3.range(thisdata[i].length))
			.rangeRoundBands([0,w],0.05));
	}

	// We use current_data to track which type of data (from thisdata) we are looking at
	var current_data = 0;

	// Initialise the variables for the SVG objects
	var rects;
	var texts;
	var titletext;
	var infodetails;

	// Clears entire SVG
	function clearSVG() {
		choreosvg.selectAll("*").remove();
	}

	// RGB string for a color using a square root scale between the two colors provided
	function colorRects(color1,color2,yValue,yMinValue,yMaxValue) {

		var scaleR = d3.scale.sqrt()
			.domain([yMinValue,yMaxValue])
			.rangeRound([color1[0],color2[0]]);
		var scaleG = d3.scale.sqrt()
			.domain([yMinValue,yMaxValue])
			.rangeRound([color1[1],color2[1]]);
		var scaleB = d3.scale.sqrt()
			.domain([yMinValue,yMaxValue])
			.rangeRound([color1[2],color2[2]]);

		return  rgbArrayToString([scaleR(yValue),scaleG(yValue),scaleB(yValue)]);
	}

	// Get color for a rectange with current data 
	function colorCurrentRects(yValue) {
		return colorRects(colorRanges[current_data][0],
						  colorRanges[current_data][1],
						  yValue,
						  min_data[current_data],
						  max_data[current_data]);
	}

	// Transform rgb array to string
	function rgbArrayToString(rgb) {
		return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
	}

	// Update bars - to be used when data set changes but number of bars does not
	function updateBars() {

		// Update height and fill of rectangles
		choreosvg.selectAll("rect")
			.data(thisdata[current_data])
			.transition()
			.delay(function(d,i){return i*total_rect_transition/thisdata[current_data].length;})
			.duration(rect_transition_time)
			.attr("y",function(d){ return h-yScales[current_data](d[1]);})
			.attr("height",function(d){ return yScales[current_data](d[1]);})
			.attr("fill", function(d) { return colorCurrentRects(d[1]);});

		// Update height and text of bar labels
		choreosvg.selectAll("text")
			.data(thisdata[current_data])
			.transition()
			.delay(function(d,i){return i*total_rect_transition/thisdata[current_data].length;})
			.duration(rect_transition_time)
			.text(function(d) { return d[1];})
			.attr("y", function(d) { return h - yScales[current_data](d[1])+14;});

		// Update text and color of title
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

		// Not necessary to color the info text as color gets set on thh fly.

	} // End of UpdateBars()

	// Create Bars - to be used when the number of bars changes. Should be called after clearSVG
	function createBars() {

		// Create new rectangles
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

		// Create new text
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

		// Create new title text
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
				x: w-325,
				y: 50,
				"font-family": font_family,
				"font-size": "30px",
				"text-decoration": "underline",
				"text-anchor": "middle",
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

		// Create infodetails text
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
			};

			clearSVG();

			createBars();
		}); // End of on click for titletext[1]

		//Click on type to change type of top 20
		titletext[2].on("click", function() {

			current_data += 1;
			current_data %= thisdata.length;

			updateBars();
		}); // end of on click for titletext[2]

		// Hover over bar to highlight and show info
		choreosvg.selectAll("rect").on("mouseover", function(d) {
			// Color the rectangle the highlight_color
			d3.select(this)
				.attr("fill",rgbArrayToString(highlight_colors[current_data]));

			infodetails.transition()
				.duration(50)
				.text(function(){
					return d[0] + ": " + d[1] + " " + quantifications[current_data];
				})
				.attr("fill",function(){ return rgbArrayToString(colors[current_data]);});

			// Show the info details text
			infodetails.classed("hidden", false);

		}); // end of mouseover for bars

		//Leave rectangle
		choreosvg.selectAll("rect").on("mouseout", function(d) {
			d3.select(this)
				.transition()
				.duration(250)
				.attr("fill", colorCurrentRects(d[1]));

			// Hide the info details
			infodetails.classed("hidden",true);

		}); //end of mouseout for bars

	} // end of CreateBars

	//create bars
	createBars();

} // End of toptwenty
