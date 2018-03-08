// Constants
const cityCoords = [
  {city: "Vancouver", x: 40, y: 370},
  {city: "San Francisco", x: 25, y: 470},
  {city: "Dallas", x: 175, y: 545},
  {city: "Mexico City", x: 150, y: 660}
]
const cityTemps = [
  {
    city: "Vancouver", //https://www.timeanddate.com/weather/canada/vancouver/climate
    lowTemps: [35, 35, 38, 42, 48, 53, 57, 57, 52, 45, 39, 35],
    highTemps: [45, 47, 51, 56, 62, 67, 72, 72, 66, 57, 49, 44]
  },
  {
    city: "San Francisco", //https://www.timeanddate.com/weather/usa/san-francisco/climate
    lowTemps: [44, 46, 48, 49, 52, 54, 55, 56, 56, 54, 49, 44],
    highTemps: [57, 59, 62, 64, 67, 70, 71, 72, 73, 71, 63, 57],
  },
  {
    city: "Dallas", //https://www.timeanddate.com/weather/usa/dallas/climate
    lowTemps: [38, 41, 49, 57, 66, 74, 77, 77, 70, 58, 47, 39],
    highTemps: [58, 61, 69, 77, 85, 92, 96, 97, 90, 79, 68, 58]
  },
  {
    city: "Mexico City", //https://www.timeanddate.com/weather/mexico/mexico-city/climate
    lowTemps: [42, 45, 48, 52, 54, 56, 55, 55, 55, 51, 46, 43],
    highTemps: [72, 76, 79, 81, 81, 78, 76, 76, 75, 75, 74, 72]
  }
]
const tempBuffer = 3
const indexToMonth = ["January","February","March","April","May","June","July","August","September",
  "October","November","December","Never"]

// Dimensions
const mapPlotWidth = 700
const mapPlotHeight = 720
const pinRadius = 6
const arrowTipHight = 20
const arrowTipWidth = 40
const arrowEndX = 385
const tempTextWidth = 30

// Plots
const plotMapWeather = d3.select("#mobile2 .map")
  .append("svg")
    .attr("width", mapPlotWidth)
    .attr("height", mapPlotHeight)
  .append("g")

function drawMapWeather(weatherToday) {
  let lowTemp = weatherToday.temperatureLow
  let highTemp = weatherToday.temperatureHigh
  $("#boston-high").text(Math.round(highTemp).toString())
  $("#boston-low").text(Math.round(lowTemp).toString())
  let tempMatches = matchTemps(lowTemp, highTemp)

  let img = plotMapWeather.append("svg:image")
    .attr("xlink:href", "./north-america.svg")
    .attr("width", mapPlotWidth)
    .attr("height", mapPlotHeight)
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", "translate(-280)")

  plotMapWeather.selectAll(".city-arrow-tips")
      .data(cityCoords)
      .enter().append("line")
      .attr("class", "city-arrow")
      .attr("x1", function(d) { return d.x })
      .attr("y1", function(d) { return d.y })
      .attr("x2", function(d) { return d.x + arrowTipWidth })
      .attr("y2", function(d) { return d.y - arrowTipHight })

  plotMapWeather.selectAll(".city-arrow-tips")
      .data(cityCoords)
      .enter().append("line")
      .attr("class", "city-arrow")
      .attr("x1", function(d) { return d.x + arrowTipWidth })
      .attr("y1", function(d) { return d.y - arrowTipHight })
      .attr("x2", function(d) { return arrowEndX })
      .attr("y2", function(d) { return d.y - arrowTipHight })

  plotMapWeather.selectAll(".city-pins")
      .data(cityCoords)
      .enter().append("circle")
      .attr("class", "city-pin")
      .attr("cx", function(d) { return d.x })
      .attr("cy", function(d) { return d.y })
      .attr("r", pinRadius)

  plotMapWeather.selectAll(".city-names")
      .data(tempMatches)
      .enter().append("text")
      .attr("class", "city-name")
      .attr("x", function(d) { return d.index < 12 ? arrowEndX - tempTextWidth : arrowEndX })
      .attr("y", function(d, i) { return cityCoords[i]['y'] - arrowTipHight - 10 })
      .attr("text-anchor", "end")
      .style("font-size", "20px")
      .text(function(d, i) { return cityCoords[i]['city'] })

  plotMapWeather.selectAll(".city-months")
      .data(tempMatches)
      .enter().append("text")
      .attr("class", "city-month")
      .attr("x", function(d) { return d.index < 12 ? arrowEndX - tempTextWidth : arrowEndX })
      .attr("y", function(d, i) { return cityCoords[i]['y'] + 5 })
      .attr("text-anchor", "end")
      .style("font-size", "18px")
      .text(function(d) { return indexToMonth[d.index].toUpperCase() })

  plotMapWeather.selectAll(".city-highs")
      .data(tempMatches)
      .enter().append("text")
      .attr("class", "city-high")
      .attr("x", function(d) { return arrowEndX })
      .attr("y", function(d, i) { return cityCoords[i]['y'] - arrowTipHight - 10 })
      .attr("text-anchor", "end")
      .style("font-size", "18px")
      .text(function(d) { return d.index < 12 ? d.tempHigh : "" })

  plotMapWeather.selectAll(".city-lows")
      .data(tempMatches)
      .enter().append("text")
      .attr("class", "city-low")
      .attr("x", function(d) { return arrowEndX })
      .attr("y", function(d, i) { return cityCoords[i]['y'] + 5 })
      .attr("text-anchor", "end")
      .style("font-size", "18px")
      .text(function(d) { return d.index < 12 ? d.tempLow : "" })
}

function matchTemps(lowTemp, highTemp) {
  let tempMean = (lowTemp + highTemp) / 2
  let matches = []

  for (let c = 0; c < cityTemps.length; c++) {
    let city = cityTemps[c]
    let minError = Infinity
    let bestIndex = 12
    let bestLow = -Infinity
    let bestHigh = Infinity
    for (let i = 0; i < 12; i++) {
      let cityLow = city.lowTemps[i]
      let cityHigh = city.highTemps[i]
      let cityMean = (cityLow + cityHigh) / 2
      if (tempMean < (cityHigh + tempBuffer) && tempMean > (cityLow - tempBuffer)
        && minError > Math.abs(tempMean - cityMean)) {
        bestIndex = i
        bestLow = cityLow
        bestHigh = cityHigh
        minError = Math.abs(tempMean - cityMean)
      }
    }
    matches.push({
      'index': bestIndex,
      'tempLow': bestLow,
      'tempHigh': bestHigh
    })
  }
  return matches
}
