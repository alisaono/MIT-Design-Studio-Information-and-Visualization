// Constants
const totalHours = 8
const hourlyInterval = 24 / totalHours
const totalDays = 8
const tempRows = 5
const tempPadding = 5
const tempRanges = [
  {max: 40, color: "#4183D7", opacity: 0.5}, // Cold
  {max: 60, color: "#19B5FE", opacity: 0.3}, // Chilly
  {max: 80, color: "#fdcb6e", opacity: 0.4}, // Warm
  {max: Infinity, color: "#e17055", opacity: 0.4}, // Hot
]

// Dimensions
const margin = {top: 18, right: 30, bottom: 18, left: 30}
const plotWidth = d3.select('#mobile1').node().clientWidth - margin.left - margin.right
const cellSize = plotWidth / totalDays
const plotHeight = cellSize * (tempRows + 1)
const dotRadius = 5
const titleCellColor = "#596275"

// Plots
const plotHourlyWeather = d3.select("#mobile1 .hourly")
  .append("svg")
    .attr("width", plotWidth + margin.left + margin.right)
    .attr("height", plotHeight + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

const plotDailyWeather = d3.select("#mobile1 .daily")
  .append("svg")
    .attr("width", plotWidth + margin.left + margin.right)
    .attr("height", plotHeight + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

function drawHourlyWeather(weatherHourly){
  let weatherExtracted = []
  for (let i = 0; i < totalHours; i++) {
    weatherExtracted.push(weatherHourly[i * hourlyInterval])
  }

  let xLabels = []
  const extentDay = d3.extent(weatherExtracted, function(d){
    xLabels.push(new Date (d.time * 1000))
    return new Date (d.time * 1000)
  })

  // X-axis scale
  const xScale = d3.scaleTime()
      .domain(extentDay)
      .range([plotWidth / (totalHours * 2 + 1), (totalHours * 2) / (totalHours * 2 + 1) * plotWidth])

  // Data for grid lines
  const gridArray = [...Array(totalHours + 1).keys()]

  drawSingleLineChart(plotHourlyWeather, weatherExtracted, xScale, gridArray, xLabels)
}

function drawDailyWeather(weatherDaily){
  const extentWeek = d3.extent(weatherDaily, function(d){
    return new Date (d.time * 1000)
  })

  // X-axis scale
  const xScale = d3.scaleTime()
      .domain(extentWeek)
      .range([plotWidth / (totalDays * 2 + 1), (totalDays * 2) / (totalDays * 2 + 1) * plotWidth])

  // Data for grid lines
  const gridArray = [...Array(totalDays + 1).keys()]

  drawDoubleLineChart(plotDailyWeather, weatherDaily, xScale, gridArray)
}

function drawSingleLineChart(plot, weatherData, xScale, gridArray, xLabels) {
  const minTemp = d3.min(weatherData, function(d){ return d.temperature })
  const maxTemp = d3.max(weatherData, function(d){ return d.temperature })
  const minY = Math.floor((minTemp - tempPadding) / 10) * 10
  const maxY = Math.ceil((maxTemp + tempPadding) / 10) * 10

  // Scale for Y-axis
  const yScale = d3.scaleLinear()
      .domain([minY, maxY])
      .range([(plotHeight - cellSize), 0])

  // Scales for grid lines
  const xGridScale = d3.scaleLinear()
      .domain([0, gridArray.length - 1])
      .range([0, plotWidth])
  const yGridScale = d3.scaleLinear()
      .domain([0, plotHeight / cellSize])
      .range([cellSize * (plotHeight / cellSize), 0])

  // Add cell shadings for temperatures
  for (let row = 0; row < tempRows; row++) {
    let rowArea = d3.area()
      .x(function(d) { return xGridScale(d) })
      .y(function(d) { return plotHeight - cellSize * (row + 2) })
      .y1(function(d) { return plotHeight - cellSize * (row + 1) })

    let temp = (yScale.domain()[1] - yScale.domain()[0]) * (row + 1) / tempRows + yScale.domain()[0]
    let tempIndex = 0
    while (tempRanges[tempIndex]['max'] < temp) {
      tempIndex++
    }

    plot.append("path")
      .attr("fill", tempRanges[tempIndex]['color'])
      .attr("opacity", tempRanges[tempIndex]['opacity'])
      .attr("d", rowArea(gridArray))
  }

  // Add cell shadings for days
  const areaDays = d3.area()
    .x(function(d) { return xGridScale(d) })
    .y(function(d) { return plotHeight - cellSize })
    .y1(function(d) { return plotHeight })

  plot.append("path")
    .attr("fill", titleCellColor)
    .attr("d", areaDays(gridArray))

  // Add X-axis
  plot.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (plotHeight - cellSize) + ")")
      .style("font-size", "12px")
      .style("font-family", "Open Sans")
      .call(
        d3.axisBottom(xScale)
          .tickValues(xLabels)
          .tickSize(0, 0)
          .tickPadding(cellSize / 2 - 3)
          .tickFormat(d3.timeFormat("%-H%p")))

  // Remove line and ticks for X-axis
  plot.select(".x-axis .domain").remove()

  // Add grid lines
  plot.append("g")
    .attr("class", "grid")
    .call(
      d3.axisBottom(xGridScale)
        .tickSizeInner(plotHeight)
        .tickFormat(""))

  plot.append("g")
    .attr("class", "grid")
    .call(
      d3.axisLeft(yGridScale)
        .ticks(plotHeight / cellSize)
        .tickSizeInner(-plotWidth)
        .tickFormat(""))

  // Remove unneccesary grid lines
  plot.selectAll(".grid .domain").remove()

  // Add line
  const lineHourly = d3.line()
      .x(function(d) { return xScale(new Date (d.time*1000)) })
      .y(function(d) { return yScale(d.temperature) })

  plot.append("path")
      .datum(weatherData)
      .attr("class", "line")
      .attr("d", lineHourly)

  // Add dots
  plot.selectAll(".dots")
      .data(weatherData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function(d) { return xScale(new Date (d.time * 1000)) })
      .attr("cy", function(d) { return yScale(d.temperature) })
      .attr("r", dotRadius)

  // Add dot labels
  plot.selectAll(".dot-labels")
      .data(weatherData)
      .enter().append("text")
      .attr("class", "dot-label")
      .attr("x", function(d) { return xScale(new Date (d.time * 1000)) })
      .attr("y", function(d) { return yScale(d.temperature) })
      .attr("transform", `translate(0, -8)`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(function(d) { return Math.round(d.temperature).toString() })
}

function drawDoubleLineChart(plot, weatherData, xScale, gridArray) {
  const minTemp = d3.min(weatherData, function(d){ return d.temperatureLow })
  const maxTemp = d3.max(weatherData, function(d){ return d.temperatureHigh })
  const minY = Math.floor((minTemp - tempPadding) / 10) * 10
  const maxY = Math.ceil((maxTemp + tempPadding) / 10) * 10

  // Scale for Y-axis
  const yScale = d3.scaleLinear()
      .domain([minY, maxY])
      .range([(plotHeight - cellSize), 0])

  // Scales for grid lines
  const xGridScale = d3.scaleLinear()
      .domain([0, gridArray.length - 1])
      .range([0, plotWidth])
  const yGridScale = d3.scaleLinear()
      .domain([0, plotHeight / cellSize])
      .range([cellSize * (plotHeight / cellSize), 0])

  // Add cell shadings for temperatures
  for (let row = 0; row < tempRows; row++) {
    let rowArea = d3.area()
      .x(function(d) { return xGridScale(d) })
      .y(function(d) { return plotHeight - cellSize * (row + 2) })
      .y1(function(d) { return plotHeight - cellSize * (row + 1) })

    let temp = (yScale.domain()[1] - yScale.domain()[0]) * (row + 1) / tempRows + yScale.domain()[0]
    let tempIndex = 0
    while (tempRanges[tempIndex]['max'] < temp) {
      tempIndex++
    }

    plot.append("path")
      .attr("fill", tempRanges[tempIndex]['color'])
      .attr("opacity", tempRanges[tempIndex]['opacity'])
      .attr("d", rowArea(gridArray))
  }

  // Add cell shadings for days
  const areaDays = d3.area()
    .x(function(d) { return xGridScale(d) })
    .y(function(d) { return plotHeight - cellSize })
    .y1(function(d) { return plotHeight })

  plot.append("path")
    .attr("fill", titleCellColor)
    .attr("d", areaDays(gridArray))

  // Add X-axis
  plot.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (plotHeight - cellSize) + ")")
      .style("font-size", "12px")
      .style("font-family", "Open Sans")
      .call(
        d3.axisBottom(xScale)
          .ticks(gridArray.length - 1)
          .tickSize(0, 0)
          .tickPadding(cellSize / 2 - 3)
          .tickFormat(d3.timeFormat("%a")))

  // Remove line and ticks for X-axis
  plot.select(".x-axis .domain").remove()

  // Add grid lines
  plot.append("g")
    .attr("class", "grid")
    .call(
      d3.axisBottom(xGridScale)
        .tickSizeInner(plotHeight)
        .tickFormat(""))

  plot.append("g")
    .attr("class", "grid")
    .call(
      d3.axisLeft(yGridScale)
        .ticks(plotHeight / cellSize)
        .tickSizeInner(-plotWidth)
        .tickFormat(""))

  // Remove unneccesary grid lines
  plot.selectAll(".grid .domain").remove()

  // Create line for low temperatures
  const lineDailyLow = d3.line()
      .x(function(d) { return xScale(new Date (d.time*1000)) })
      .y(function(d) { return yScale(d.temperatureLow) })

  // Create line for high temperatures
  const lineDailyHigh = d3.line()
      .x(function(d) { return xScale(new Date (d.time * 1000)) })
      .y(function(d) { return yScale(d.temperatureHigh) })

  // Add line for low temperatures
  plot.append("path")
      .datum(weatherData)
      .attr("class", "line")
      .attr("d", lineDailyLow)

  // Add line for high temperatures
  plot.append("path")
      .datum(weatherData)
      .attr("class", "line")
      .attr("d", lineDailyHigh)

  // Add dots for low temperatures
  plot.selectAll(".dots-low")
      .data(weatherData)
      .enter().append("circle")
      .attr("class", "dot-low dot")
      .attr("cx", function(d) { return xScale(new Date (d.time * 1000)) })
      .attr("cy", function(d) { return yScale(d.temperatureLow) })
      .attr("r", dotRadius)

  // Add dots for high temperatures
  plot.selectAll(".dots-high")
      .data(weatherData)
      .enter().append("circle")
      .attr("class", "dot-high dot")
      .attr("cx", function(d) { return xScale(new Date (d.time * 1000)) })
      .attr("cy", function(d) { return yScale(d.temperatureHigh) })
      .attr("r", dotRadius)

  // Add dot labels for low temperatures
  plot.selectAll(".dot-labels-low")
      .data(weatherData)
      .enter().append("text")
      .attr("class", "dot-label-low dot-label")
      .attr("x", function(d) { return xScale(new Date (d.time * 1000)) })
      .attr("y", function(d) { return yScale(d.temperatureLow) })
      .attr("transform", `translate(0, 20)`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(function(d) { return Math.round(d.temperatureLow).toString() })

  // Add dot labels for high temperatures
  plot.selectAll(".dot-labels-high")
      .data(weatherData)
      .enter().append("text")
      .attr("class", "dot-label-high dot-label")
      .attr("x", function(d) { return xScale(new Date (d.time * 1000)) })
      .attr("y", function(d) { return yScale(d.temperatureHigh) })
      .attr("transform", `translate(0, -8)`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(function(d) { return Math.round(d.temperatureHigh).toString() })
}
