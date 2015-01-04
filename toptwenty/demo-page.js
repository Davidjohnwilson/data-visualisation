// SAMPLE USAGE OF TOPTWENTY

// Load in Choreographers
d3.csv("../data/choreos.csv", function(error,dataChoreo) {
	if (error) {
		console.log(error);
		return
	}

	// Load in Ballets
	var dsv = d3.dsv("|","text/plain");
	dsv("../data/pieces.csv", function(error,dataBallets) {
		if (error) {
			console.log(error);
			return
		}

		// Load in Composers
		d3.csv("../data/opera-composers.csv", function(error,dataCompos) {
			if (error) {
				console.log(error);
				return
			}

			// Load in Operas
			var dsv = d3.dsv("|","text/plain");
			dsv("../data/opera-pieces.csv", function(error,dataOperas) {
				if (error) {
					console.log(error);
					return
				}

				//Extract ballet data into form [name,count]
				var choreodata = dataChoreo.map(function(o){
					return [o.choreographer,parseInt(o.count)];
				});
				var piecedata = dataBallets.map(function(o){
					return [o.piece,parseInt(o.count)];
				})
				var balletdata = [choreodata,piecedata];

				//Extract opera data into form [name,count]
				var composdata = dataCompos.map(function(o){
					return [o.composer,parseInt(o.count)];
				});
				var operapiecedata = dataOperas.map(function(o){
					return [o.piece,parseInt(o.count)];
				})
				var operadata = [composdata,operapiecedata];

				//Initialise variables
				var svg_id = "#svgShared";
				var h = 500;
				var w = 1000;
				var font_family = 'GulimFontFamily';
				var num_bars = [20,25,50,5,10];
				var colorRangesBallet = [[[10,50,100],[0,165,255]],[[0,100,0],[50,200,50]]];
				var colorRangesOpera = [[[10,50,100],[0,165,255]],[[0,100,0],[50,200,50]]];
				var namesBallet = ["Choreographers", "Ballets"];
				var namesOpera = ["Composers", "Operas"];
				var quantifications = ["pieces", "performances"];
				var colorsBallet = [[198, 12, 48],[198, 12, 48]];
				var colorsOpera = [[198, 12, 48],[198, 12, 48]];
				var highlightColorsBallet = [[198, 12, 48],[198, 12, 48]];
				var highlightColorsOpera = [[198, 12, 48],[198, 12, 48]];
				var rect_transition_time = 250;
				var total_rect_transition = 750;

				var titlesvg = d3.select("#svgSharedTitle");
				titlesvg.attr("width",w).attr("height",75);

				var sharedsvg = d3.select(svg_id);
				sharedsvg.attr("width",w).attr("height",h);

				//Set up Ballet data	
				toptwenty(svg_id,
						  h,
						  w,
						  font_family,
						  num_bars,
						  balletdata,
						  colorRangesBallet,
						  namesBallet,
						  quantifications,
						  colorsBallet,
						  highlightColorsBallet,
						  rect_transition_time,
						  total_rect_transition);
				// Add top title
				var toptitle = titlesvg.append("text")
					.text("The Royal Ballet")
					.attr({
						x: w/2,
						y: 50,
						"font-family": font_family,
						"font-size": "30px",
						"text-decoration": "underline",
						"text-anchor": "middle",
						fill: "#c60c30"
					});

				// set boolean for deciding if on Royal Ballet or Royal Opera
				var onBallet = true;


				//Click to change number of entries
				toptitle.on("click", function() {

					sharedsvg.selectAll("*").remove();

					if (!onBallet) {
						toptwenty(svg_id,
							  h,
							  w,
							  font_family,
							  num_bars,
							  balletdata,
							  colorRangesBallet,
							  namesBallet,
							  quantifications,
							  colorsBallet,
							  highlightColorsBallet,
							  rect_transition_time,
							  total_rect_transition);

						toptitle.text("The Royal Ballet");

					} else {
						toptwenty(svg_id,
							  h,
							  w,
							  font_family,
							  num_bars,
							  operadata,
							  colorRangesOpera,
							  namesOpera,
							  quantifications,
							  colorsOpera,
							  highlightColorsOpera,
							  rect_transition_time,
							  total_rect_transition);

						toptitle.text("The Royal Opera");
					}

					onBallet = !onBallet;

				}); // End of on click for toptitle




			});
		});
	});
});
