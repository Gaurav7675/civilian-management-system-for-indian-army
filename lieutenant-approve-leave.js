(function() {
  var container = document.getElementById("leaveList");
  if (!container) return;
  var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
  if (!cu || !cu.battalion) {
    container.innerHTML = "<p class=\"empty-msg\">No battalion assigned.</p>";
    return;
  }
  var pending = typeof getPendingLeavesForBattalion === "function" ? getPendingLeavesForBattalion(cu.battalion) : [];
  var users = typeof DB !== "undefined" ? DB.users : [];
  function getName(uid) {
    var u = users.find(function(x) { return x.id === uid; });
    return u ? u.name : uid;
  }
  if (pending.length === 0) {
    container.innerHTML = "<p class=\"empty-msg\">No pending leave requests.</p>";
    return;
  }
  pending.forEach(function(leave) {
    var card = document.createElement("div");
    card.className = "card army-card leave-card";
    card.innerHTML =
      "<h3>" + (leave.type || "Leave") + " — " + getName(leave.userId) + "</h3>" +
      "<p><b>From:</b> " + (leave.from || "—") + " <b>To:</b> " + (leave.to || "—") + "</p>" +
      "<p><b>Reason:</b> " + (leave.reason || "—") + "</p>" +
      "<p><b>Status:</b> <span class=\"army-badge pending\">Pending</span></p>" +
      "<div class=\"card-actions\">" +
      "<button type=\"button\" class=\"army-btn\" data-action=\"Forwarded\" data-id=\"" + leave.id + "\">Forward to Colonel</button> " +
      "<button type=\"button\" class=\"army-btn secondary\" data-action=\"Rejected\" data-id=\"" + leave.id + "\">Reject</button>" +
      "</div>";
    container.appendChild(card);
  });
  container.addEventListener("click", function(e) {
    var btn = e.target.closest("[data-action][data-id]");
    if (!btn || typeof updateLeaveStatus !== "function") return;
    var id = btn.getAttribute("data-id");
    var status = btn.getAttribute("data-action");
    if (updateLeaveStatus(id, status)) {
      alert(status === "Rejected" ? "Leave rejected." : "Leave forwarded to Colonel.");
      location.reload();
    }
  });
})();
