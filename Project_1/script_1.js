// Time constants
const HOUR_PER_DAY = 24
const MIN_PER_HOUR = 60
const SEC_PER_MIN = 60

// Canvas measurements
const canvasWidth = 412
const canvasHeight = 734

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

function setup() {
  const myCanvas = createCanvas(canvasWidth, canvasHeight)
  myCanvas.parent('plot1')
}

function draw() {
  background(0)

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
  strokeWeight(0)
  fill(255)
  textSize(headerSize)
  textFont(headerFont)
  textAlign(CENTER)
  text(`${timeRemain} Remaining`, canvasWidth / 2, topHeaderY)
  text('Power Source: Battery', canvasWidth / 2, btmHeaderY)

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

  stroke(255)
  strokeWeight(btryStroke)
  fill(0)
  rect(btryX, btryY, btryWidth, btryHeight, btryRad)

  fill(255)
  rect(cthdX, cthdY, cthdWidth, cthdHeight, cthdRadius)

  let charge = amount/unit
  if (charge < lowCharge) {
    stroke(255, 0, 0)
    fill(255, 0, 0)
  } else if (charge < highCharge) {
    stroke(255, 255, 0)
    fill(255, 255, 0)
  } else {
    stroke(0, 255, 0)
    fill(0, 255, 0)
  }

  let barX = btryX + (2 * btryStroke)
  let barY = btryY + (2 * btryStroke)
  let barHeight = btryHeight - (4 * btryStroke)
  let barWidth = (btryWidth - 2 * btryStroke) / unit - (2 * btryStroke)

  for (let i = 0; i < amount; i++) {
    rect(barX, barY, barWidth, barHeight, barRadius)
    barX += barWidth + (2 * btryStroke)
  }
}
