// Chart configurations with the variables needed to make the bar chart
var totalWater = {
  dataURL: 'https://data.cityofnewyork.us/resource/waf7-5gvc.csv',
  xVariable: 'year',
  yVariable: 'nyc_consumption_million_gallons_per_day',
  yAxisMin: 600,
  yAxisMax: 1600,
  yDenominator: 1,
  yLabel: 'Million Gallons Per Day',
  yLabelShort: 'MGD',
  divName: 'chart-total',
}

var totalPopulation = {
  dataURL: 'https://data.cityofnewyork.us/resource/waf7-5gvc.csv',
  xVariable: 'year',
  yVariable: 'new_york_city_population',
  yAxisMin: 6,
  yAxisMax: 8.6,
  yDenominator: 1000000,
  yLabel: 'Million People',
  yLabelShort: 'M',
  divName: 'chart-population',
}

var waterPerCapita = {
  dataURL: 'https://data.cityofnewyork.us/resource/waf7-5gvc.csv',
  xVariable: 'year',
  yVariable: 'per_capita_gallons_per_person_per_day',
  yAxisMin: 80,
  yAxisMax: 220,
  yDenominator: 1,
  yLabel: 'Gallons Per Capita Per Day',
  yLabelShort: 'GPCD',
  divName: 'chart-per-capita',
}

// Call the makeBarChart function using the configs for the three desired charts
makeBarChart(totalWater)
makeBarChart(totalPopulation)
makeBarChart(waterPerCapita)

// Function which creates a bar chart in a specified div using the chart config passed to it as a variable
function makeBarChart(chartConfig) {

  var margin = {top: 40, right: 40, bottom: 70, left: 60};

  var dataURL = chartConfig.dataURL;
  var xVariable = chartConfig.xVariable;
  var yVariable = chartConfig.yVariable;
  var yAxisMin = chartConfig.yAxisMin;
  var yAxisMax = chartConfig.yAxisMax;
  var yDenominator = chartConfig.yDenominator;
  var yLabel = chartConfig.yLabel;
  var yLabelShort = chartConfig.yLabelShort;
  var divName = chartConfig.divName;
  var chartHeight = 180;
  var width = getInnerWidth() - margin.right - margin.left;

  // Parse the Data
  d3.csv(dataURL, function(data) {

    // add the SVG element
    var svg = d3.select("#" + divName)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d[xVariable]; }))
      .padding(1);
    svg.append("g")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-12,10)rotate(-90)")
        .style("text-anchor", "end")
        .style("font-size", "9px");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([yAxisMin, yAxisMax]).nice()
      .range([chartHeight, 0]);
    svg.append("g")
      .call(d3.axisLeft(y))
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -55) // offset to left of axis
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-size", "9px")
      .text(yLabel);


    // functions that will add commas for thousands and round to 2 decimal places
    var formatThousands = d3.format(',.1f');

    // Define the tooltop for hover
    var tool_tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return formatThousands(d[yVariable]/yDenominator) + " " + yLabelShort;
    })

    // Apply the tooltip to the svg
    svg.call(tool_tip);

    // Add the area chart
    svg.append("path")
      .datum(data)
      .attr("fill", "#cfe9ff")
      .attr("stroke", "navy")
      .attr("stroke-width", 0)
      .attr("d", d3.area()
        .x(function(d) { return x(d[xVariable]) })
        .y0(y(yAxisMin))
        .y1(function(d) { return y(d[yVariable]/yDenominator) })
      );

    // add the Y gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .ticks(10)
            .tickSize(-width)
            .tickFormat("")
        )

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
        .attr("fill", "navy")
        .attr("stroke", "none")
        .attr("cx", function(d) { return x(d[xVariable]) })
        .attr("cy", function(d) { return y(d[yVariable]/yDenominator) })
        .attr("r", 3)
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)
        .style("opacity", 0)
        .transition()
        .delay(function(d,i){ return i * 50 })
        .style("opacity", 1);
  })
}

function getInnerWidth() {
  var innerWidth = parseFloat(window.getComputedStyle(document.getElementById("main"), null).getPropertyValue("width"));
  console.log(innerWidth);
  return innerWidth;
}
