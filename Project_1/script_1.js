const batteryClock = function (p) {
  // Headers measurements
  const headerSize = 28
  const headerFont = 'Arial'
  const topHeaderY = 74
  const btmHeaderY = 132

  // Battery measurements
  const btryHeight = 120
  const btryWidth = 300
  const btryX = 54
  const btryInitY = 194
  const btryPad = 60
  const btryRad = 10
  const btryStroke = 2
  const cthdHeight = 50
  const cthdWidth = 10
  const cthdRadius = 1
  const barRadius = 3

  // Charge thresholds
  const lowCharge = 0.2
  const highCharge = 0.5

  p.setup = function() {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  p.draw = function() {
    p.background(0)

    // Obtain current time
    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    // Compute remaining time
    let secRemain = (60 - seconds) % 60
    let minRemain = seconds > 0 ? 59 - minutes : (60 - minutes) % 60
    let hrRemain = (seconds > 0 || minutes > 0) ? 23 - hours : 24 - hours

    let timeRemain
    if (minRemain < 10) {
      timeRemain = `${hrRemain}:0${minRemain}`
    } else {
      timeRemain = `${hrRemain}:${minRemain}`
    }

    // Drawing the headers
    p.strokeWeight(0)
    p.fill(255)
    p.textSize(headerSize)
    p.textFont(headerFont)
    p.textAlign(p.CENTER)
    p.text(`${timeRemain} Remaining`, CANVAS_WIDTH / 2, topHeaderY)
    p.text('Power Source: Battery', CANVAS_WIDTH / 2, btmHeaderY)

    // Drawing the hours
    drawBattery(0, hrRemain, HOUR_PER_DAY)

    // Drawing the minutes
    drawBattery(1, minRemain, MIN_PER_HOUR)

    // Drawing the second
    drawBattery(2, secRemain, SEC_PER_MIN)
  }

  function drawBattery(index, amount, unit) {
    let btryY = btryInitY + index * (btryHeight + btryPad)
    let cthdX = btryX + btryWidth + (2 * btryStroke)
    let cthdY = btryY + (btryHeight / 2) - (cthdHeight / 2)

    p.stroke(255)
    p.strokeWeight(btryStroke)
    p.fill(0)
    p.rect(btryX, btryY, btryWidth, btryHeight, btryRad)

    p.fill(255)
    p.rect(cthdX, cthdY, cthdWidth, cthdHeight, cthdRadius)

    let charge = amount/unit
    if (charge < lowCharge) {
      p.stroke(255, 0, 0)
      p.fill(255, 0, 0)
    } else if (charge < highCharge) {
      p.stroke(255, 255, 0)
      p.fill(255, 255, 0)
    } else {
      p.stroke(0, 255, 0)
      p.fill(0, 255, 0)
    }

    let barX = btryX + (2 * btryStroke)
    let barY = btryY + (2 * btryStroke)
    let barHeight = btryHeight - (4 * btryStroke)
    let barWidth = (btryWidth - 2 * btryStroke) / unit - (2 * btryStroke)

    for (let i = 0; i < amount; i++) {
      p.rect(barX, barY, barWidth, barHeight, barRadius)
      barX += barWidth + (2 * btryStroke)
    }
  }
}

new p5(batteryClock, 'power_source')
