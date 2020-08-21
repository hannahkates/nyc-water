// Chart configurations with the variables needed to make the bar chart
var totalWater = {
  dataURL: 'https://data.cityofnewyork.us/resource/waf7-5gvc.csv',
  xVariable: 'year',
  yVariable: 'nyc_consumption_million_gallons_per_day',
  yAxisMin: 600,
  yAxisMax: 1600,
  yDenominator: 1,
  yLabel: 'Million Gallons Per Day',
  divName: 'chart-total',
  height: getHeight(),
  width: getWidth(),
}

var totalPopulation = {
  dataURL: 'https://data.cityofnewyork.us/resource/waf7-5gvc.csv',
  xVariable: 'year',
  yVariable: 'new_york_city_population',
  yAxisMin: 6,
  yAxisMax: 8.6,
  yDenominator: 1000000,
  yLabel: 'Million People',
  divName: 'chart-population',
  height: getHeight(),
  width: getWidth(),
}

var waterPerCapita = {
  dataURL: 'https://data.cityofnewyork.us/resource/waf7-5gvc.csv',
  xVariable: 'year',
  yVariable: 'per_capita_gallons_per_person_per_day',
  yAxisMin: 80,
  yAxisMax: 220,
  yDenominator: 1,
  yLabel: 'Gallons Per Capita Per Day',
  divName: 'chart-per-capita',
  height: getHeight(),
  width: getWidth(),
}

// Call the makeBarChart function using the configs for the three desired charts
makeBarChart(totalWater)
makeBarChart(totalPopulation)
makeBarChart(waterPerCapita)

// Function which creates a bar chart in a specified div using the chart config passed to it as a variable
function makeBarChart(chartConfig) {

  var dataURL = chartConfig.dataURL;
  var xVariable = chartConfig.xVariable;
  var yVariable = chartConfig.yVariable;
  var yAxisMin = chartConfig.yAxisMin;
  var yAxisMax = chartConfig.yAxisMax;
  var yDenominator = chartConfig.yDenominator;
  var yLabel = chartConfig.yLabel;
  var divName = chartConfig.divName;
  var height = chartConfig.height;
  var width = chartConfig.width;

  var margin = {top: 20, right: 20, bottom: 70, left: 90};

  // Parse the Data
  d3.csv(dataURL, function(data) {

    // add the SVG element
    var svg = d3.select("#" + divName).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d[xVariable]; }))
      .padding(1);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-12,10)rotate(-90)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([yAxisMin, yAxisMax])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y))
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -62) // offset to left of axis
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);;

    // Define the tooltop for hover
    var tool_tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d[yVariable]/yDenominator;
    })

    // Apply the tooltip to the svg
    svg.call(tool_tip);

    // Add the area chart
    svg.append("path")
      .datum(data)
      .attr("fill", "steelblue")
      .attr("stroke", "navy")
      .attr("stroke-width", 0)
      .attr("d", d3.area()
        .x(function(d) { return x(d[xVariable]) })
        .y0(y(yAxisMin))
        .y1(function(d) { return y(d[yVariable]/yDenominator) })
      );

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "navy")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d[xVariable]) })
        .y(function(d) { return y(d[yVariable]/yDenominator) })
        )

    // Add the circles
    svg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
        .attr("fill", "#00AAFF")
        .attr("stroke", "none")
        .attr("cx", function(d) { return x(d[xVariable]) })
        .attr("cy", function(d) { return y(d[yVariable]/yDenominator) })
        .attr("r", 4)
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

  })
}

function getWidth() {
  return document.getElementById("left-pane-charts").offsetWidth;
}

function getHeight() {
  return document.getElementById("left-pane-charts").offsetHeight;
}
