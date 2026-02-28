(function() {
  var container = document.getElementById("transferList");
  if (!container) return;
  var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
  if (!cu || !cu.battalion) {
    container.innerHTML = "<p class=\"empty-msg\">No battalion assigned.</p>";
    return;
  }
  var pending = typeof getPendingTransfersForBattalion === "function" ? getPendingTransfersForBattalion(cu.battalion) : [];
  var users = typeof DB !== "undefined" ? DB.users : [];
  function getName(uid) {
    var u = users.find(function(x) { return x.id === uid; });
    return u ? u.name : uid;
  }
  if (pending.length === 0) {
    container.innerHTML = "<p class=\"empty-msg\">No pending transfer requests to forward.</p>";
    return;
  }
  pending.forEach(function(t) {
    var card = document.createElement("div");
    card.className = "card army-card transfer-card";
    card.innerHTML =
      "<h3>Transfer: " + getName(t.userId) + "</h3>" +
      "<p><b>From:</b> " + (t.fromBattalion || "—") + " <b>To:</b> " + (t.toBattalion || "—") + "</p>" +
      "<p><b>Reason:</b> " + (t.reason || "—") + "</p>" +
      "<div class=\"card-actions\">" +
      "<button type=\"button\" class=\"army-btn\" data-action=\"Forwarded\" data-id=\"" + t.id + "\">Forward to Colonel</button> " +
      "<button type=\"button\" class=\"army-btn secondary\" data-action=\"Rejected\" data-id=\"" + t.id + "\">Reject</button>" +
      "</div>";
    container.appendChild(card);
  });
  container.addEventListener("click", function(e) {
    var btn = e.target.closest("[data-action][data-id]");
    if (!btn || typeof updateTransferStatus !== "function") return;
    var id = btn.getAttribute("data-id");
    var status = btn.getAttribute("data-action");
    if (updateTransferStatus(id, status)) {
      alert(status === "Rejected" ? "Transfer rejected." : "Transfer forwarded to Colonel.");
      location.reload();
    }
  });
})();
