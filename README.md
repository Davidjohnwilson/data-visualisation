# Data Visualisation

A collection of data visualisation examples built over *D3.js*.

Currently includes:
 - `toptwenty`: an easy way to give multiple "Top 20" lists from a collection of CSV files. Allows for changing the topic of the list and the number of elements of the list dynamically. Includes rollover text for further info.


## `toptwenty.js`

 Easily create an interactive SVG from input data, showing multiple "Top 20" lists. The end user can click to change the number of bars shown, or the data being displayed. Can accept an arbitrary number of data sets.

### Usage:

Include `toptwenty.js` in your page, and then call `toptwenty` with the following syntax:

 ```javascript
		toptwenty(svg_id,
				  h,
				  w,
				  font_family,
				  num_bars,
				  alldata,
				  colorRanges,
				  names,
				  quantifications,
				  colors,
				  highlight_colors,
				  rect_transition_time,
				  total_rect_transition);
 ```
