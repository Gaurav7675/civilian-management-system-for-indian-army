(function() {
  var container = document.getElementById("transferList");
  if (!container) return;
  var pending = typeof getTransfersPendingFinal === "function" ? getTransfersPendingFinal() : [];
  var users = typeof DB !== "undefined" ? DB.users : [];
  function getName(uid) {
    var u = users.find(function(x) { return x.id === uid; });
    return u ? u.name : uid;
  }
  if (pending.length === 0) {
    container.innerHTML = "<p class=\"empty-msg\">No transfer requests pending final approval.</p>";
    return;
  }
  pending.forEach(function(t) {
    var card = document.createElement("div");
    card.className = "card army-card transfer-card";
    card.innerHTML =
      "<h3>" + getName(t.userId) + " — Transfer Order</h3>" +
      "<p><b>From:</b> " + (t.fromBattalion || "—") + " <b>To:</b> " + (t.toBattalion || "—") + "</p>" +
      "<p><b>Reason:</b> " + (t.reason || "—") + "</p>" +
      "<div class=\"card-actions\">" +
      "<button type=\"button\" class=\"army-btn\" data-action=\"Approved\" data-id=\"" + t.id + "\">Approve</button> " +
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
      alert("Transfer " + status.toLowerCase() + ".");
      location.reload();
    }
  });
})();
