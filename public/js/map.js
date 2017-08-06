function getMaps(element){ 

console.log("component is: ", element.value);	
 
document.getElementById("pollutionInfo").innerHTML = element.value +  " value in US over a period of 2006 -2010. ";

//d3.csv("Phoneix_Data_Pollution.csv", function(d) {
d3.csv("pollution_us_2006_2010.csv", function(d) {
	return {
	    //year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
	    state : d.State,
	    county : d.County,
	    city : d.City,
	    date : new Date(d.Date),
	    NO2_mean : +d["NO2 Mean"],
	    NO2_units : d["NO2 Units"],
	    O3_mean : +d["O3 Mean"],	
	    O3_Units : d["O3 Units"],
	    SO2_mean : +d["SO2 Mean"],
	    SO2_Units : d["SO2 Units"],
	    CO_mean : +d["CO Mean"],
	    CO_Units : d["CO Units"]
	  };
	}, function(error, data) {
	  	console.log(data[0]);
	  	if (error) throw error;
	  	
	  	var meanDataByState = d3.nest()
	  	                    .key(function(d) {return d.state;})
	  	                    .rollup(function(v) { return d3.mean(v, function(d) {
	  	                    													  if(element.value === "NO2_mean" ){return d.NO2_mean;}
	  	                    													  if(element.value === "SO2_mean" ){return d.SO2_mean;}
	  	                    													  if(element.value === "O3_mean" ){return d.O3_mean;}
	  	                    													  if(element.value === "CO_mean" ){return d.CO_mean;}
	  	                    	                                                 }); 
	  	                                         })
	  	                    .entries(data);
	  	  	
	  	loadMaps(meanDataByState,element.value);
	});
}

function loadMaps(meanDataByState, poll_element){
	
	getScales(poll_element);

	var m_width = 
    width = $("#map").width(),
    height = $("#map").width(),
    //country,
    state;

	if(poll_element === "NO2_mean"){
		var color = d3.scaleThreshold()
		.domain([5,20,40])
		 .range(["#ffffcc","#c2e699","#78c679","#31a354"]);
	}
	if(poll_element === "O3_mean"){
		var color = d3.scaleThreshold()
		.domain([0,0.02,0.04])
		 .range(["#ffffb3","#ffe0b3","#ffad33","#ff9900"]);
	}
	if(poll_element === "SO2_mean"){
		var color = d3.scaleThreshold()
		.domain([0,3,10,25])
		 .range(["#ffe6ff", "#faebf5","#e085c2","#cc3399"]);
	}
	if(poll_element === "CO_mean"){
		var color = d3.scaleThreshold()
		.domain([0,0.5,2,3])
		 .range(["#cce6ff","#ff80b3","#ff3333","#ff0000"]);
	}





var projection = d3.geoAlbersUsa();
    
var path = d3.geoPath().projection(projection);

var svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);      
 
var g = svg.append("g")
.attr("class", "key")
.attr("transform", "translate(40,40)");

svg.selectAll("rect")       
.append("rect")
.attr("class", "background")
.attr("width", width)
.attr("height", height)        
.on("click", state_clicked);

console.log("mean_data : ", meanDataByState);

d3.json("states_usa.topo.json" , function(error, us) {
	
	//Loop through each state data value in the .csv file
	for (var i = 0; i < meanDataByState.length; i++) {

		/* if(meanDataByState[i].value > max_mean_data){
			 max_mean_data = meanDataByState[i].value;
			 max_state = meanDataByState[i].key;
		 }*/
		// Grab State Name
		var dataState = meanDataByState[i].key;

		// Grab data value 
		var meanValue = meanDataByState[i].value;
		
		// Find the corresponding state inside the GeoJSON
		for (var j = 0; j < topojson.feature(us, us.objects.states).features.length; j++)  {
			var jsonState = topojson.feature(us, us.objects.states).features[j].properties.name;

			if (dataState == jsonState) {

			// Copy the data value into the JSON
				topojson.feature(us, us.objects.states).features[j].properties.dataValue = meanValue; 

			// Stop looking through the JSON
			break;
			}
		}
	}
	


    g.append("g")
      .attr("id", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter()
      .append("path")
      .attr("id", function(d) { return d.id; })
      .attr("class", "active")
      .attr("d", path)
       .style("fill", function(d) {    	                
    	    var value = d.properties.dataValue;
    		if (value) {
	    		//If value exists…
	    		return color(value);
    		} else {
	    		//If value is undefined…
	    		return "rgb(213,222,217)";
    		}
       })    	 
      .on("click", state_clicked)
      .on('mouseover', function(d, i) {

       var currentState = this;
       		d3.select(this).style('fill-opacity', 1);
       })
       .on('mouseout', function(d, i) {
        	  
               d3.selectAll('path')
                       .style('fill-opacity',.7 );
        })
        
      
});

function get_xyz(d) {
  var bounds = path.bounds(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .96 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [x, y, z];
}

function state_clicked(d) {
  g.selectAll("#cities").remove();

  if (d && state !== d) {
    var xyz = get_xyz(d);
    state = d;

    country_code = state.id.substring(0, 3).toLowerCase();
    state_name = state.properties.name;

    d3.json("cities_usa.topo.json", function(error, us) {
      g.append("g")
        .attr("id", "cities")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }))
        .enter()
        .append("path")
        .attr("id", function(d) { return d.properties.name; })
        .attr("class", "city")
        .attr("d", path.pointRadius(20 / xyz[2]));

      zoom(xyz);
    });

    loadLineGraph(state_name, poll_element);
  } else {
    state = null;
  }
}

	$(window).resize(function() {
	  var w = $("#map").width();
	  svg.attr("width", w);
	  svg.attr("height", w * height / width);
	});

}
	
