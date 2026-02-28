(function() {
  var card = document.getElementById("battalionCard");
  if (!card) return;
  var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
  if (!cu) {
    card.innerHTML = "<p class=\"empty-msg\">Session expired. Please login again.</p>";
    return;
  }
  var bn = cu.battalion || "—";
  var battalionInfo = typeof DB !== "undefined" && DB.battalions ? DB.battalions.find(function(b) { return b.name === bn; }) : null;
  card.innerHTML =
    "<h3 class=\"army-title\" style=\"margin-bottom:12px\">&#9873; " + bn + "</h3>" +
    "<p><b>Unit:</b> " + bn + "</p>" +
    (battalionInfo ? "<p><b>Location:</b> " + (battalionInfo.location || "—") + "</p><p><b>Strength:</b> " + (battalionInfo.strength || "—") + "</p>" : "<p><b>Location:</b> —</p><p><b>Strength:</b> —</p>") +
    "<p class=\"form-hint\" style=\"margin-top:16px\">Your battalion assignment is managed by your unit. Contact HQ for transfer requests.</p>";
})();
