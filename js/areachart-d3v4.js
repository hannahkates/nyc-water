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

// instantiate the scrollama
const scroller = scrollama();

// the intial default visibility for all the chart divs is false.
// this keeps the circle animations from being added to the svgs.
let divIsVisible = false;

function renderCharts() {
  // Call the makeChart function using the configs for the three desired charts
  makeChart(totalWater, divIsVisible)
  makeChart(totalPopulation, divIsVisible)
  makeChart(waterPerCapita, divIsVisible)
}

// Function which creates a bar chart in a specified div using the chart config passed to it as a variable
function makeChart(chartConfig, divVisibility) {

  var margin = {top: 30, right: 15, bottom: 50, left: 45};

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

    // responsivity: remove the SVG that may already exists for the chart
    d3.select(`#svg-${divName}`).remove();

    // add the SVG element and give it a unique ID
    svg = d3.select("#" + divName)
      .append("svg")
        .attr("id", `svg-${divName}`)
        .attr("width", width + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Define X
    var x = d3.scaleLinear()
      .range([ 0, width ])
      .domain([1979, 2019]);

    // Define Y axis
    var y = d3.scaleLinear()
      .domain([yAxisMin, yAxisMax]).nice()
      .range([chartHeight, 0]);

    // Render the area chart
    svg.append("path")
      .datum(data)
      .attr("fill", "#cfe9ff")
      .attr("stroke", "#00006e")
      .attr("stroke-width", 0)
      .attr("d", d3.area()
        .x(function(d) { return x(d[xVariable]) })
        .y0(y(yAxisMin))
        .y1(function(d) { return y(d[yVariable]/yDenominator) })
      );

    // Render x axis (on top of the path area so lines are visible)
    svg.append("g")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(d3.axisBottom(x)
        .ticks(20, "y")
        .tickSize(0)
      )
      .selectAll("text")
        .attr("transform", "translate(-5,5)rotate(-90)")
        .style("text-anchor", "end")
        .style("font-size", "11px");

    // Render y axis and grid lines (on top of the path area so lines are visible)
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .ticks(6)
        .tickSize(-width)
      )
      .selectAll("text")
        .style("font-size", "11px");;
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -44) // offset to left of axis
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text(yLabel);

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#00006e")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d[xVariable]) })
        .y(function(d) { return y(d[yVariable]/yDenominator) })
        )

    // functions that will add commas for thousands and round to 2 decimal places
    var formatThousands = d3.format(',.1f');

    // Define the tooltop for hover
    var tool_tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return `${formatThousands(d[yVariable]/yDenominator)} ${yLabelShort}<br><i>(yr ${d[xVariable]})</i>`;
    })

    // Apply the tooltip to the svg
    svg.call(tool_tip);

    // Only add the circle animations once the specific div is visible in the viewport
    if (divVisibility == true) {
      // Add the circles
      svg.selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
          .attr("fill", "#0000bc")
          .attr("stroke", "none")
          .attr("cx", function(d) { return x(d[xVariable]) })
          .attr("cy", function(d) { return y(d[yVariable]/yDenominator) })
          .attr("r", 3)
          .on('mouseover', tool_tip.show)
          .on('mouseout', tool_tip.hide)
          .style("opacity", 0)
          .transition()
          .delay(function(d,i){ return i * 70 })
          .style("opacity", 1);
    }
  })
}

function toggleAnimation(currentDiv, newVisibility) {
  if (currentDiv == 'chart-total') {
    makeChart(totalWater, newVisibility);
  } else if (currentDiv == 'chart-population') {
    makeChart(totalPopulation, newVisibility);
  } else {
    makeChart(waterPerCapita, newVisibility);
  }
}

// setup the instance, pass callback functions
scroller
  .setup({
    step: ".step",
    offset: 0.5
  })
  .onStepEnter(response => {
    toggleAnimation(response.element.id, true)
  })
  .onStepExit(response => {
    toggleAnimation(response.element.id, false)
  });

function getInnerWidth() {
  var innerWidth = parseFloat(window.getComputedStyle(document.getElementById("main"), null).getPropertyValue("width"));
  return innerWidth;
}

// setup resize events
window.addEventListener("resize", renderCharts);
window.addEventListener("resize", scroller.resize);

renderCharts();
