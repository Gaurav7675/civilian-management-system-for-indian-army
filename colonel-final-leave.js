(function() {
  var container = document.getElementById("leaveList");
  if (!container) return;
  var pending = typeof getLeavesPendingFinal === "function" ? getLeavesPendingFinal() : [];
  var users = typeof DB !== "undefined" ? DB.users : [];
  function getName(uid) {
    var u = users.find(function(x) { return x.id === uid; });
    return u ? u.name : uid;
  }
  if (pending.length === 0) {
    container.innerHTML = "<p class=\"empty-msg\">No leave requests pending final approval.</p>";
    return;
  }
  pending.forEach(function(leave) {
    var card = document.createElement("div");
    card.className = "card army-card leave-card";
    card.innerHTML =
      "<h3>" + (leave.type || "Leave") + " — " + getName(leave.userId) + "</h3>" +
      "<p><b>From:</b> " + (leave.from || "—") + " <b>To:</b> " + (leave.to || "—") + "</p>" +
      "<p><b>Reason:</b> " + (leave.reason || "—") + "</p>" +
      "<div class=\"card-actions\">" +
      "<button type=\"button\" class=\"army-btn\" data-action=\"Approved\" data-id=\"" + leave.id + "\">Approve</button> " +
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
      alert("Leave " + status.toLowerCase() + ".");
      location.reload();
    }
  });
})();
