console.log("[compass] Client Resource Started")

globalThis.exports("compass:toggle", toggleCompass)
globalThis.exports("compass:setSettings", setSettings)

const settings = {
  // get the compass visibility from the resource kvps
  isCompassVisible: Boolean(GetResourceKvpInt("compass:visible")),
  compassWidth: 0.35,
  compassY: 0.1,
  compassColor: [255, 255, 255] as [number, number, number],
  directions: ["N", "NO", "O", "SO", "S", "SW", "W", "NW"],
  controlKey: 311 // "K"
}

// register command to toggle compass
RegisterCommand("compass", toggleCompass, false)

function setSettings (s: Partial<typeof settings>) {
  Object.assign(settings, s)
}

function toggleCompass() {
  settings.isCompassVisible = !settings.isCompassVisible
  console.log("[compass] Toggling compass", settings.isCompassVisible)
  SetResourceKvpInt("compass:visible", Number(settings.isCompassVisible))
}

setTick(() => {
  if (settings.isCompassVisible) return renderCompass()
  
  // if key "K" is pressed down, render the compass
  if (IsControlPressed(0, settings.controlKey)) {
    renderCompass()
  }
})

function renderCompass() {
  const heading = getHeading()

  // draw triangle in the middle of the compass
  DrawRect(0.5, settings.compassY, 0.001, 0.015, ...settings.compassColor, 125)

  renderDirections(heading)
  renderLines(heading)
}

function renderDirections (heading: number) {
  // render the cardinal directions
  for (let i = 0; i < settings.directions.length; i++) {
    const direction = settings.directions[i]
    const x = getScreenHeading(heading + (i * 360 / settings.directions.length))
    if (notWithinBounds(x, settings.compassWidth)) continue
    const alpha = getAlphaFromBounds(x, settings.compassWidth)

    if (i % 2 === 0) {
      renderText(direction, x, settings.compassY + 0.01,  0.35, 0, ...settings.compassColor, alpha)
      continue
    }
    renderText(direction, x, settings.compassY + 0.01, 0.2, 0, ...settings.compassColor, alpha)
  }
}

function renderLines (heading: number) {
  // render direction lines every 15 degrees
  for (let i = 0; i < 360; i += 15) {
    const x = getScreenHeading(heading + i)
    if (notWithinBounds(x, settings.compassWidth)) continue
    const alpha = getAlphaFromBounds(x, settings.compassWidth)

    // draw degree text    
    renderText(i.toString(), x, settings.compassY - 0.025, 0.15, 0, ...settings.compassColor, alpha)
      
    // draw bigger line every 90 degrees
    if (i % 90 === 0) {
      DrawRect(x, settings.compassY, 0.001, 0.015, ...settings.compassColor, alpha)
      continue
    }
    // draw medium line every 45 degrees
    if (i % 45 === 0) {
      DrawRect(x, settings.compassY, 0.001, 0.01, ...settings.compassColor, alpha)
      continue
    }
    // draw smaller line every 15 degrees
    DrawRect(x, settings.compassY, 0.001, 0.002, ...settings.compassColor, alpha)
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

function renderText(text: string, x: number, y: number, scale: number, font: number, r: number, g: number, b: number, a: number) {
  SetTextFont(font)
  SetTextScale(scale, scale)
  SetTextColour(r, g, b, a)
  SetTextOutline()
  SetTextEntry("STRING")
  SetTextJustification(0)
  AddTextComponentString(text)
  DrawText(x, y)
}