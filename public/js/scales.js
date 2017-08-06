function getScales(poll_element){

d3.selectAll("#scale > *").remove();	
	
var width = $("#scale").width(),
    height = $("#scale").height();

//5,20,40,80

if(poll_element === "NO2_mean"){
	var color = d3.scaleThreshold()
	    .domain([5,20,40])
	    .range(["#ffffcc","#c2e699","#78c679","#31a354"]);
	
	// A position encoding for the key only.
	var x = d3.scaleLinear()
	    .domain([0, 100])
	    .range([0, 240]);
}

if(poll_element === "O3_mean"){
	var color = d3.scaleThreshold()
		.domain([0,0.02,0.04])
		 .range(["#ffffb3","#ffe0b3","#ffad33","#ff9900"]);
	
	// A position encoding for the key only.
	var x = d3.scaleLinear()
	    .domain([0, 0.1])
	    .range([0, 240]);
}

if(poll_element === "SO2_mean"){
	var color = d3.scaleThreshold()
		.domain([0,3,10])
		.range(["#ffe6ff", "#faebf5","#e085c2","#cc3399"]);
	
	// A position encoding for the key only.
	var x = d3.scaleLinear()
	    .domain([0, 35])
	    .range([0, 240]);
}

if(poll_element === "CO_mean"){
	var color = d3.scaleThreshold()
		.domain([0,0.5,2])
		.range(["#cce6ff","#ff80b3","#ff3333","#b30000"]);
	
	// A position encoding for the key only.
	var x = d3.scaleLinear()
	    .domain([0, 8])
	    .range([0, 240]);
}

var xAxis = d3.axisBottom()
    .scale(x)
    .tickSize(13)
    .tickValues(color.domain());

var svg = d3.select("#scale")
.attr("width", width)
.attr("height", height);


var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(40,40)");

g.selectAll("rect")
    .data(color.range().map(function(d, i) {
      return {
        x0: i ? x(color.domain()[i - 1]) : x.range()[0],
        x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
        z: d
      };
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return d.x0; })
    .attr("width", function(d) { return d.x1 - d.x0; })
    .style("fill", function(d) { return d.z; });

g.call(xAxis).append("text")
    .attr("class", "caption")
    .attr("y", -6)
    .text("Pollution per billion units");

}