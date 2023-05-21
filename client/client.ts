console.log("[compass] Client Resource Started")

// get the compass visibility from the resource kvps
let isCompassVisible = Boolean(GetResourceKvpInt("compass:visible"))
const compassWidth = 0.35
const compassY = 0.1

// register command to toggle compass
RegisterCommand("compass", () => {
  isCompassVisible = !isCompassVisible
  console.log("[compass] Toggling compass", isCompassVisible)
  SetResourceKvpInt("compass:visible", Number(isCompassVisible))
}, false)

setTick(() => {
  if (isCompassVisible) return renderCompass()
  
  // if key "K" is pressed down, render the compass
  if (IsControlPressed(0, 311)) {
    renderCompass()
  }
})

function renderCompass() {
  const heading = getHeading()

  // draw triangle in the middle of the compass
  DrawRect(0.5, compassY, 0.001, 0.015, 255, 255, 255, 125)

  renderDirections(heading)
  renderLines(heading)
}

function renderDirections (heading: number) {
  // render the cardinal directions
  const directions = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"] as const
  const steps = 360 / directions.length
  
  
  for (let i = 0; i < directions.length; i++) {
    const direction = directions[i]
    const x = getScreenHeading(heading + (i * steps))
    if (notWithinBounds(x, compassWidth)) continue
    const alpha = getAlphaFromBounds(x, compassWidth)

    if (i % 2 === 0) {
      renderText(direction, x, compassY + 0.01,  0.35, 0, 255, 255, 255, alpha)
      continue
    }
    renderText(direction, x, compassY + 0.01, 0.2, 0, 255, 255, 255, alpha)
  }
}

function renderLines (heading: number) {
  // render direction lines every 15 degrees
  for (let i = 0; i < 360; i += 15) {
    const x = getScreenHeading(heading + i)
    if (notWithinBounds(x, compassWidth)) continue
    const alpha = getAlphaFromBounds(x, compassWidth)

    // draw degree text    
    renderText(i.toString(), x, compassY - 0.025, 0.15, 0, 255, 255, 255, alpha)
      
    // draw bigger line every 90 degrees
    if (i % 90 === 0) {
      DrawRect(x, compassY, 0.001, 0.015, 255, 255, 255, alpha)
      continue
    }
    // draw medium line every 45 degrees
    if (i % 45 === 0) {
      DrawRect(x, compassY, 0.001, 0.01, 255, 255, 255, alpha)
      continue
    }
    // draw smaller line every 15 degrees
    DrawRect(x, compassY, 0.001, 0.002, 255, 255, 255, alpha)
  }
}

function getScreenHeading (heading: number) {
  let x = 0.5 + (heading / 360)
  return x > 1 ? x - 1 : x
}

function getHeading () {
  return GetGameplayCamRot(2)[2] // is -180 to 180, where 0 is north
}

function notWithinBounds (x: number, width: number) {
  return Math.abs(x - 0.5) > width / 2
}

function getAlphaFromBounds (x: number, width: number) {
  return Math.round(255 - (255 * (Math.abs(0.5 - x) / (width / 2))))
}

function renderText(text: string, x: number, y: number, scale: number, font: number, r = 255, g = 255, b = 255, a = 255) {
  SetTextFont(font)
  SetTextScale(scale, scale)
  SetTextColour(r, g, b, a)
  SetTextOutline()
  SetTextEntry("STRING")
  SetTextJustification(0)
  AddTextComponentString(text)
  DrawText(x, y)
}