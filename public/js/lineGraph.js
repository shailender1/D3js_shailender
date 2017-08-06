function loadLineGraph(stateMap, poll_element){
	
	d3.selectAll("#chart > *").remove();
	
	document.getElementById("lineChart").innerHTML = poll_element + "value timeline for " + stateMap;
	
	console.log("the state is: ", stateMap);
	
	var svg = d3.select("#chart");
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeFormat("%d-%b-%y");
	
	var x = d3.scaleTime()
	.rangeRound([0, width]);

	var y = d3.scaleLinear()
	.rangeRound([height, 0]);	
	
	var line = d3.line()
	.x(function(d) { 
		             console.log(d.key);
		             return x(d.key); })
	.y(function(d) { console.log(d.value);
		              return y(d.value);});
	
	d3.csv("pollution_us_2006_2010.csv", function(d) {
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
		  	if (error) throw error;
		  	
		  	var dataByState = d3.nest()
		  	                    .key(function(d) {return d.state;})
		  	                    .entries(data);
	  	 

		  	for (var i = 0; i < dataByState.length; i++) {

		  		console.log(typeof(dataByState[i].key));
                if(dataByState[i].key === stateMap ){
                	var dataFiltered = dataByState[i].value;

                	break;
                }                
				
		  	}
		  	
		  	 if(dataFiltered === undefined){		  		
			  		 console.log("No data exists");
			  		 document.getElementById("lineData").innerHTML = "No Data exists";			  	 
		  		 
		  	 }else{
			 var dataByMonths = d3.nest()
             .key(function (d){return d.date.getFullYear()})
               .rollup(function(v) { return d3.mean(v, function(d) { 		  			
								  	                        	if(poll_element === "NO2_mean" ){return y(d.NO2_mean);}
										  	    				if(poll_element === "SO2_mean" ){return y(d.SO2_mean);}
										  	  					if(poll_element === "O3_mean" ){return y(d.O3_mean);}
										  	  					if(poll_element === "CO_mean" ){return y(d.CO_mean);}	
             	                                             });
               })

             .entries (dataFiltered)

             console.log("filtered data is: ", dataByMonths);
	
		      var mindate = new Date("2006"),
	            maxdate = new Date("2010");
	        
			  //x.domain(d3.extent(dataByMonths, function(d) { return d.key; }));
		      x.domain(["2006","2010"]);
			  y.domain(d3.extent(dataByMonths, function(d) { return d.value; }));
	          	  
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
			  
			 	 
				  g.datum(dataByMonths)	
				      .append("path")
				      .attr("fill", "none")
				      .attr("stroke", "steelblue")
				      .attr("stroke-linejoin", "round")
				      .attr("stroke-linecap", "round")		      
				      .attr("stroke-width", 1.5)
				      .attr("d", line);
			 
			 
			 
		  	 }
		  	 
		});
}



	
