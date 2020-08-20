// Chart configurations with the variables needed to make the bar chart
var totalWater = {
  jsonURL: 'https://data.cityofnewyork.us/resource/waf7-5gvc.json',
  xVariable: 'year',
  yVariable: 'nyc_consumption_million_gallons_per_day',
  yDenominator: 1,
  yLabel: 'Million Gallons Per Day',
  divName: 'chart-total',
  height: 300,
  width: 1000,
}

var waterPerCapita = {
  jsonURL: 'https://data.cityofnewyork.us/resource/waf7-5gvc.json',
  xVariable: 'year',
  yVariable: 'per_capita_gallons_per_person_per_day',
  yDenominator: 1,
  yLabel: 'Avg. Gallons of Water Per Person Per Day',
  divName: 'chart-per-capita',
  height: 300,
  width: 1000,
}

var totalPopulation = {
  jsonURL: 'https://data.cityofnewyork.us/resource/waf7-5gvc.json',
  xVariable: 'year',
  yVariable: 'new_york_city_population',
  yDenominator: 1000000,
  yLabel: 'Million People',
  divName: 'chart-population',
  height: 300,
  width: 1000,
}

function makeBarChart(chartConfig) {

  var jsonURL = chartConfig.jsonURL;
  var xVariable = chartConfig.xVariable;
  var yVariable = chartConfig.yVariable;
  var yDenominator = chartConfig.yDenominator;
  var yLabel = chartConfig.yLabel;
  var divName = chartConfig.divName;
  var height = chartConfig.height;
  var width = chartConfig.width;

  var margin = {top: 20, right: 20, bottom: 70, left: 90};
  // set the ranges
  // x: ([start, end], outerPadding)
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

  // y: (top of axis, bottom of axis)
  var y = d3.scale.linear().range([height, 0]);

  // define the axes
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  // add the SVG element
  var chart = d3.select("#" + divName).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // load the data
  d3.json(jsonURL, function(error, data) {

      data.forEach(function(d) {
          d.xVariable = d[xVariable];
          d.yVariable = +d[yVariable]/yDenominator;
      });

    // scale the range of the data
    x.domain(data.map(function(d) { return d.xVariable; }));
    y.domain([0, d3.max(data, function(d) { return d.yVariable; })]);

    // define the axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    // add axis
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -62) // offset to left of axis
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);


    // Add bar chart
    chart.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.xVariable); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.yVariable); })
        .attr("height", function(d) { return height - y(d.yVariable); });

  });
}

makeBarChart(totalWater)
makeBarChart(waterPerCapita)
makeBarChart(totalPopulation)


//
// // get the dimensions of the browser window
// function getWidth() {
//   return Math.max(
//     document.body.scrollWidth,
//     document.documentElement.scrollWidth,
//     document.body.offsetWidth,
//     document.documentElement.offsetWidth,
//     document.documentElement.clientWidth
//   );
// }
//
// function getHeight() {
//   return Math.max(
//     document.body.scrollHeight,
//     document.documentElement.scrollHeight,
//     document.body.offsetHeight,
//     document.documentElement.offsetHeight,
//     document.documentElement.clientHeight
//   );
// }
//
// // set the dimensions of the canvas
// var margin = {top: 20, right: 20, bottom: 70, left: 100},
//     width = getWidth()/2 - margin.left - margin.right,
//     height = getHeight()/1.5 - margin.top - margin.bottom;
//
