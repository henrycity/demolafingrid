var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 70, left: 60},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);
var	parseDate = d3.timeParse("%Y-%m-%d")
var hAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat("%Y-%m-%d"));
var vAxis = d3.axisLeft().scale(y).tickFormat(d3.format("s"));
var div = d3.select('body').append('div')
              .attr("class", "tooltip")
              .style("opacity", 0);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// real consumption
d3.csv("datasets/consumption.csv", function(d) {
  d.date = parseDate(d.date);
  d.consumption = +d.consumption;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.consumption; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(hAxis)
      .selectAll("text")
					.style("text-anchor", "end")
          .style("fill", "#e0e0e0")
					.attr("dx", "-.8em")
					.attr("dy", "-.55em")
					.attr("transform", "rotate(-90)" );

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "s"))
      .selectAll("text")
					.style("text-anchor", "end")
          .style("fill", "#e0e0e0");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("y", function(d) { return y(d.consumption); })
      .attr("width", 0.8*x.bandwidth())
      .attr("height", function(d) { return height - y(d.consumption); })
      .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div	.html(d.consumption+"MWh/h")
                .style("left", (110+x(d.date)) + "px")
                .style("top", (250+y(d.consumption)) + "px");
            })
      .on("mouseout", function(d) {
           div.transition()
               .duration(500)
               .style("opacity", 0);
       });
});

d3.csv("datasets/consumption-forecast.csv", function(d) {
  d.date = parseDate(d.date);
  d.consumption = +d.consumption;
  return d;
}, function(error, data) {
  if (error) throw error;
  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.consumption); });
  // var dot = d3.dot()
  //   .cx(function(d) { return cx(d.date); })
  //   .cy(function(d) { return cy(d.consumption); });
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.consumption; })]);
  g.append("path")
      .attr("transform", "translate(" + 0.4*x.bandwidth() + ", 0)")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      //.curveCardinal()
      .style("stroke", "white")
      .style("fill", "none")
      .style("stroke-width", "4px")
      .style("stroke-linecap", "round")
      .style("stroke-linejoin", "round");
      // .append("dot")
      // .attr("r", 3.5)
      // .attr("cx", x(d.date))
      // .attr("cy", y(d.consumption));

})
