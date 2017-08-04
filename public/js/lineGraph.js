function loadLineGraph(stateMap){
	var svg = d3.select("svg"),
	margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeFormat("%d-%b-%y");

	var x = d3.scaleTime()
	.rangeRound([0, width]);

	var y = d3.scaleLinear()
	.rangeRound([height, 0]);

	var line = d3.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.NO2_mean); });

	d3.csv("data/pollution_us_2006_2010.csv", function(d) {
		  return {
		    //year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
		    state : d.State,
		    county : d.County,
		    city : d.City,
		    date : new Date(d.Date),
		    NO2_mean : +d["NO2 Mean"],
		    NO2_units : d["NO2 Units"],
		    O3_Mean : +d["O3 Mean"],	
		    O3_Units : d["O3 Units"],
		    SO2_Mean : +d["SO2 Mean"],
		    SO2_Units : d["SO2 Units"],
		    CO_Mean : +d["CO Mean"],
		    CO_Units : d["CO Units"]
		  };
		}, function(error, data) {
		  	console.log(data[0]);
		  	if (error) throw error;
		  	
		  	var dataByState = d3.nest()
		  	                    .key(function(d) {return d.state;})
		  	                    .entries(data);
	        
			  x.domain(d3.extent(data, function(d) { return d.date; }));
			  y.domain(d3.extent(data, function(d) { return d.NO2_mean; }));
	          	  
			  
			  g.append("g")
			      .attr("transform", "translate(0," + height + ")")
			      .call(d3.axisBottom(x))
			      .select(".domain");


			  g.append("g")
			      .call(d3.axisLeft(y))
			      .append("text")
			      .attr("fill", "#000")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", "0.71em")
			      .attr("text-anchor", "end")
			      .text("Parts per Billion");	             
			  
			 console.log(stateMap); 
			 var dataFiltered = dataByState.filter(function (d) { return d.key === stateMap });
			 console.log(dataFiltered);
			 console.log(data);
			  
			  g.datum(dataFiltered[0].values)	
			      .append("path")
			      .attr("fill", "none")
			      .attr("stroke", "steelblue")
			      .attr("stroke-linejoin", "round")
			      .attr("stroke-linecap", "round")		      
			      .attr("stroke-width", 1.5)
			      .attr("d", line);
	        
		});
}