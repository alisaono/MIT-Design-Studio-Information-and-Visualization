const tileClock = function (p) {
  // Constants for time text
  const hrTextY = 300
  const minTextY = 600
  const textSize = 200
  const hrTextColor = 0
  const minTextColor = 0
  const textFont = 'Walter Turncoat'

  // Constants for tiles
  const tileShapes = [
    // First row
    [0, 0, 75, 0, 65, 75, 0, 60],
    [75, 0, 130, 0, 140, 65, 65, 75],
    [130, 0, 215, 0, 205, 70, 140, 65],
    [215, 0, 280, 0, 290, 75, 205, 70],
    [280, 0, 345, 0, 340, 65, 290, 75],
    [345, 0, CANVAS_WIDTH, 0, CANVAS_WIDTH, 75, 340, 65],
    // Second row
    [0, 60, 65, 75, 70, 130, 0, 145],
    [65, 75, 140, 65, 135, 145, 70, 130],
    [140, 65, 205, 70, 210, 135, 135, 145],
    [205, 70, 290, 75, 280, 145, 210, 135],
    [290, 75, 340, 65, 350, 140, 280, 145],
    [340, 65, CANVAS_WIDTH, 75, CANVAS_WIDTH, 135, 350, 140],
    // Third row
    [0, 145, 70, 130, 75, 215, 0, 205],
    [70, 130, 135, 145, 145, 205, 75, 215],
    [135, 145, 210, 135, 210, 215, 145, 205],
    [210, 135, 280, 145, 290, 205, 210, 215],
    [280, 145, 350, 140, 340, 215, 290, 205],
    [350, 140, CANVAS_WIDTH, 135, CANVAS_WIDTH, 205, 340, 215],
    // Forth row
    [0, 205, 75, 215, 65, 280, 0, 290],
    [75, 215, 145, 205, 140, 285, 65, 280],
    [145, 205, 210, 215, 220, 275, 140, 285],
    [210, 215, 290, 205, 280, 290, 220, 275],
    [290, 205, 340, 215, 350, 280, 280, 290],
    [340, 215, CANVAS_WIDTH, 205, CANVAS_WIDTH, 290, 350, 280],
    // Fifth row
    [0, 290, 65, 280, 75, 370, 0, 355],
    [65, 280, 140, 285, 150, 355, 75, 370],
    [140, 285, 220, 275, 215, 370, 150, 355],
    [220, 275, 280, 290, 290, 355, 215, 370],
    [280, 290, 350, 280, 345, 370, 290, 355],
    [350, 280, CANVAS_WIDTH, 290, CANVAS_WIDTH, 360, 345, 370],
    // Sixth row
    [0, 355, 75, 370, 65, 454, 0, 444],
    [75, 370, 150, 355, 140, 449, 65, 454],
    [150, 355, 215, 370, 220, 459, 140, 449],
    [215, 370, 290, 355, 280, 444, 220, 459],
    [290, 355, 345, 370, 350, 454, 280, 444],
    [345, 370, CANVAS_WIDTH, 360, CANVAS_WIDTH, 444, 350, 454],
    // Seventh row
    [0, 529, 75, 519, 65, 454, 0, 444],
    [75, 519, 145, 529, 140, 449, 65, 454],
    [145, 529, 210, 519, 220, 459, 140, 449],
    [210, 519, 290, 529, 280, 444, 220, 459],
    [290, 529, 340, 519, 350, 454, 280, 444],
    [340, 519, CANVAS_WIDTH, 529, CANVAS_WIDTH, 444, 350, 454],
    // Eighth row
    [0, 589, 70, 604, 75, 519, 0, 529],
    [70, 604, 135, 589, 145, 529, 75, 519],
    [135, 589, 210, 599, 210, 519, 145, 529],
    [210, 599, 280, 589, 290, 529, 210, 519],
    [280, 589, 350, 594, 340, 519, 290, 529],
    [350, 594, CANVAS_WIDTH, 599, CANVAS_WIDTH, 529, 340, 519],
    // Nineth row
    [0, 674, 65, 659, 70, 604, 0, 589],
    [65, 659, 140, 669, 135, 589, 70, 604],
    [140, 669, 205, 664, 210, 599, 135, 589],
    [205, 664, 290, 659, 280, 589, 210, 599],
    [290, 659, 340, 669, 350, 594, 280, 589],
    [340, 669, CANVAS_WIDTH, 659, CANVAS_WIDTH, 599, 350, 594],
    // Tenth row
    [0, CANVAS_HEIGHT, 75, CANVAS_HEIGHT, 65, 659, 0, 674],
    [75, CANVAS_HEIGHT, 130, CANVAS_HEIGHT, 140, 669, 65, 659],
    [130, CANVAS_HEIGHT, 215, CANVAS_HEIGHT, 205, 664, 140, 669],
    [215, CANVAS_HEIGHT, 280, CANVAS_HEIGHT, 290, 659, 205, 664],
    [280, CANVAS_HEIGHT, 345, CANVAS_HEIGHT, 340, 669, 290, 659],
    [345, CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_WIDTH, 659, 340, 669]
  ]
  const tileColors = ['#2ecc71','#16a085','#3498db','#8e44ad','#c0392b','#d35400','#f39c12','#f1c40f']
  const numColors = tileColors.length

  let colorIndex = 0
  let tileToColor = []

  p.setup = function() {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)

    // Initialize the tiles
    for (let shape of tileShapes) {
      tileToColor.push(tileColors[colorIndex])
      drawTile(shape, tileColors[colorIndex])
      colorIndex = (colorIndex + 1) % numColors
    }

    p.textFont(textFont)
    p.frameRate(1)
  }

  p.draw = function() {
    // Obtain current time
    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()

    // Draw tile for current seconds
    tileToColor[seconds] = tileColors[colorIndex]
    colorIndex = (colorIndex + 1) % numColors
    for (let i = 0; i < tileShapes.length; i++) {
      drawTile(tileShapes[i], tileToColor[i])
    }

    // Draw current hours and minutes
    drawTime(hours, minutes)
  }

  function drawTile(s, color) {
    p.strokeWeight(1)
    p.stroke(255)
    p.fill(color)
    p.quad(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7])
  }

  function drawTime(hours, minutes) {
    let strHours = hours < 10 ? '0' + hours : hours.toString()
    let strMinutes = minutes < 10 ? '0' + minutes : minutes.toString()

    p.noStroke()
    p.textFont(textFont)
    p.textSize(textSize)
    p.textAlign(p.CENTER)

    p.fill(hrTextColor)
    p.text(strHours, CANVAS_WIDTH / 2, hrTextY)

    p.fill(minTextColor)
    p.text(strMinutes, CANVAS_WIDTH / 2, minTextY)
  }
}

new p5(tileClock, 'plot3')
