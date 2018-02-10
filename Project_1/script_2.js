const simpleClock = function (p) {
  // Hours measurements
  const hrCenterX = 79
  const hrCenterY = 106
  const hrRadius = 136
  const hrTheta = Math.PI + 2.2521
  const hrSize = 46
  const hrColor = 24
  const hrFont = 'Verdana'

  // Minutes measurements
  const minCenterX = 390
  const minCenterY = 488
  const minRadius = 300
  const minTheta = 2.2521
  const minSize = 24
  const minColor = 44
  const minFont = 'Verdana'

  // Seconds measurements
  const secCenterX = 390
  const secCenterY = 484
  const secRadius = 210
  const secTheta = 2.2521
  const secSize = 16
  const secColor = 64
  const secFont = 'Verdana'

  // Line measurements
  const lineColor = 'rgba(38,50,56,0.2)'
  const lineWidth = 18
  const lineEndY = 502

  p.setup = function() {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  p.draw = function() {
    p.background(255)

    // Draw the indicator line
    drawIndicator()

    // Obtain current time
    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    // Drawing the hours
    drawHours(hours)

    // Drawing the minutes
    drawMinutes(minutes)

    // Drawing the seconds
    drawSeconds(seconds)
  }

  function drawIndicator() {
    p.stroke(lineColor)
    p.strokeWeight(lineWidth)

    p.line(0, 0, CANVAS_WIDTH, lineEndY)
  }

  function drawHours(hours) {
    p.fill(hrColor)
    p.noStroke()
    p.textSize(hrSize)
    p.textFont(hrFont)
    p.textAlign(p.CENTER)

    let theta = THETA_PER_HOUR * (hours - 1) + hrTheta
    for (let h = 1; h <= 12; h++) {
      x = hrCenterX + hrRadius * Math.cos(theta)
      y = hrCenterY - hrRadius * Math.sin(theta)
      p.text(h.toString(), x, y)
      theta = theta - THETA_PER_HOUR
    }
  }

  function drawMinutes(minutes) {
    p.fill(minColor)
    p.noStroke()
    p.textSize(minSize)
    p.textFont(minFont)
    p.textAlign(p.CENTER)

    let theta = THETA_PER_MINUTE * minutes + minTheta
    for (let m = 0; m <= 59; m++) {
      x = minCenterX + minRadius * Math.cos(theta)
      y = minCenterY - minRadius * Math.sin(theta)
      p.text(m.toString(), x, y)
      theta = theta - THETA_PER_MINUTE
    }
  }

  function drawSeconds(seconds) {
    p.fill(secColor)
    p.noStroke()
    p.textSize(secSize)
    p.textFont(secFont)
    p.textAlign(p.CENTER)

    let theta = THETA_PER_SECOND * seconds + secTheta
    for (let s = 0; s <= 59; s++) {
      x = secCenterX + secRadius * Math.cos(theta)
      y = secCenterY - secRadius * Math.sin(theta)
      p.text(s.toString(), x, y)
      theta = theta - THETA_PER_SECOND
    }
  }
}

new p5(simpleClock, 'plot2')
