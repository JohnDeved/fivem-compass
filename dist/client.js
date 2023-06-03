(() => {
  // client/client.ts
  console.log("[compass] Client Resource Started");
  globalThis.exports("compass:toggle", toggleCompass);
  globalThis.exports("compass:setSettings", setSettings);
  var settings = {
    isCompassVisible: Boolean(GetResourceKvpInt("compass:visible")),
    compassWidth: 0.35,
    compassY: 0.1,
    compassColor: [255, 255, 255],
    directions: ["N", "NO", "O", "SO", "S", "SW", "W", "NW"],
    controlKey: 311
  };
  RegisterCommand("compass", toggleCompass, false);
  function setSettings(s) {
    Object.assign(settings, s);
  }
  function toggleCompass() {
    settings.isCompassVisible = !settings.isCompassVisible;
    console.log("[compass] Toggling compass", settings.isCompassVisible);
    SetResourceKvpInt("compass:visible", Number(settings.isCompassVisible));
  }
  setTick(() => {
    if (settings.isCompassVisible)
      return renderCompass();
    if (IsControlPressed(0, settings.controlKey)) {
      renderCompass();
    }
  });
  function renderCompass() {
    const heading = getHeading();
    DrawRect(0.5, settings.compassY, 1e-3, 0.015, ...settings.compassColor, 125);
    renderDirections(heading);
    renderLines(heading);
  }
  function renderDirections(heading) {
    for (let i = 0; i < settings.directions.length; i++) {
      const direction = settings.directions[i];
      const x = getScreenHeading(heading + i * 360 / settings.directions.length);
      if (notWithinBounds(x, settings.compassWidth))
        continue;
      const alpha = getAlphaFromBounds(x, settings.compassWidth);
      if (i % 2 === 0) {
        renderText(direction, x, settings.compassY + 0.01, 0.35, 0, ...settings.compassColor, alpha);
        continue;
      }
      renderText(direction, x, settings.compassY + 0.01, 0.2, 0, ...settings.compassColor, alpha);
    }
  }
  function renderLines(heading) {
    for (let i = 0; i < 360; i += 15) {
      const x = getScreenHeading(heading + i);
      if (notWithinBounds(x, settings.compassWidth))
        continue;
      const alpha = getAlphaFromBounds(x, settings.compassWidth);
      renderText(i.toString(), x, settings.compassY - 0.025, 0.15, 0, ...settings.compassColor, alpha);
      if (i % 90 === 0) {
        DrawRect(x, settings.compassY, 1e-3, 0.015, ...settings.compassColor, alpha);
        continue;
      }
      if (i % 45 === 0) {
        DrawRect(x, settings.compassY, 1e-3, 0.01, ...settings.compassColor, alpha);
        continue;
      }
      DrawRect(x, settings.compassY, 1e-3, 2e-3, ...settings.compassColor, alpha);
    }
  }
  function getScreenHeading(heading) {
    let x = 0.5 + heading / 360;
    return x > 1 ? x - 1 : x;
  }
  function getHeading() {
    return GetGameplayCamRot(2)[2];
  }
  function notWithinBounds(x, width) {
    return Math.abs(x - 0.5) > width / 2;
  }
  function getAlphaFromBounds(x, width) {
    return Math.round(255 - 255 * (Math.abs(0.5 - x) / (width / 2)));
  }
  function renderText(text, x, y, scale, font, r, g, b, a) {
    SetTextFont(font);
    SetTextScale(scale, scale);
    SetTextColour(r, g, b, a);
    SetTextOutline();
    SetTextEntry("STRING");
    SetTextJustification(0);
    AddTextComponentString(text);
    DrawText(x, y);
  }
})();
