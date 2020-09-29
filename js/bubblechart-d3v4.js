var dataset = {
  "children": [
    { "name": "Non-revenue", "size": 21 },
    { "name": "Residential", "size": .79*60.9 },
    { "name": "Mixed-Use Residential", "size": .79*16 },
    { "name": "Commercial", "size": .79*6.4 },
    { "name": "Industry", "size": .79*1.9 },
    { "name": "Institutional", "size": .79*4.6 },
    { "name": "Other", "size": .79*(100-60.9-16-6.4-1.9-4.6) }
  ]
};

var color = d3.scaleOrdinal()
  	.range(["#0048ad", "#52a1fa", "#3662c2", "#00b7ff", "#2f2fde", "#00006e", "#5488ab"]);

function renderCharts() {

  // diameter of the circle that the bubbles will be contained within
  var diameter = getInnerWidth();

  var bubble = d3.pack(dataset)
      .size([diameter, diameter])
      .padding(1);

  // responsivity: remove the SVG that may already exists for the chart
  d3.select("#svg-chart-bubble").remove();

  var svg = d3.select("#chart-bubble")
      .append("svg")
      .attr("id", "svg-chart-bubble")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  // what is this doing?
  var nodes = d3.hierarchy(dataset)
      .sum(function(d) { return d.size; });

  var node = svg.selectAll(".node")
      .data(bubble(nodes).descendants())
      .enter()
      .filter(function(d){
          return  !d.children
      })
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
      });

  node.append("circle")
      .attr("r", function(d) {
          return d.r;
      })
      .style("fill", function(d,i) {
          return color(i);
      });

  node.append("text")
      .attr("dy", "-0.5rem")
      .style("text-anchor", "middle")
      .text(function(d) {
          return `${d.data.name}:`;
      })
      .attr("font-family", "Anaheim")
      .attr("font-weight", "bold")
      .attr("font-size", function(d){
        if (d.r/5 > 12) {
          return d.r/5;
        } else {
          return 12;
        }
      })
      .attr("fill", "white");

    node.append("text")
      .attr("dy", "0.7em")
      .style("text-anchor", "middle")
      .text(function(d) {
          return `${Math.round(d.data.size)}%`;
      })
      .attr("font-family", "Anaheim")
      .attr("font-weight", "bold")
      .attr("font-size", function(d){
        if (d.r/5 > 12) {
          return 2*d.r/5;
        } else {
          return 20;
        }
      })
      .attr("fill", "white");

  d3.select(self.frameElement)
      .style("height", diameter + "px");


}


function getInnerWidth() {
  var innerWidth = parseFloat(window.getComputedStyle(document.getElementById("main"), null).getPropertyValue("width"));
  return innerWidth;
}

// setup resize events
window.addEventListener("resize", renderCharts);

renderCharts();
