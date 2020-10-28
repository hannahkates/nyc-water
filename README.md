# Data Viz: NYC's trends in water consumption over time

[hannahkates.com/nyc-water](hannahkates.com/nyc-water)

## About
This is a data storytelling project that explains NYC's water conservation efforts and trends in the decline in total water demand. It is a simple vanilla JavaScript application that includes four d3.js data visualizations.

## Data sources
- The three area charts are dependent on live data from [NYC Open Data, Dept. of Environmental Protection, "Water Consumption In The New York City" (updated annually)](https://data.cityofnewyork.us/Environment/Water-Consumption-In-The-New-York-City/ia2d-e54m)
- The bubble chart uses static data from a [2011 Dept. of Environmental Protection report](https://www1.nyc.gov/assets/em/downloads/pdf/hazard_mitigation/nycs_risk_landscape_chapter_4.7_watershortage.pdf), that I manually [transcribed into the JavaScript](https://github.com/hannahkates/nyc-water/blob/master/js/bubblechart-d3v4.js#L1) for the chart.

## Dependencies
- d3 v4
- To trigger chart animations as the reader scrolls, I used [Scrollama](https://github.com/russellgoldenberg/scrollama) created by Russell Goldenberg.
- To implement tooltips, I used d3-tip.js written by Justin Palmer. I [copied the code directly into this repo](https://github.com/hannahkates/nyc-water/blob/master/js/d3-tip.js) because I had trouble finding a stable, secure link to a hosted version online.

## How to run this application locally
- Clone repo `git clone https://github.com/hannahkates/nyc-water.git`
- Run using python dev server `python -m SimpleHTTPServer` (or other local server options like Atom Live Server)
