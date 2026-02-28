(function() {
  var leaveCards = document.getElementById("leaveCards");
  if (!leaveCards) return;

  var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
  var leaves = (typeof getLeavesByUser === "function" && cu) ? getLeavesByUser(cu.id) : [];

  if (leaves.length === 0) {
    leaveCards.innerHTML = '<p class="empty-msg">No leave records found.</p>';
  } else {
    leaves.forEach(function(leave) {
      var card = document.createElement("div");
      card.className = "card army-card leave-card";
      var statusClass = leave.status === "Approved" ? "approved" : leave.status === "Rejected" ? "rejected" : "pending";
      card.innerHTML =
        '<h3>' + (leave.type || "Leave") + '</h3>' +
        '<p><b>From:</b> ' + (leave.from || "—") + '</p>' +
        '<p><b>To:</b> ' + (leave.to || "—") + '</p>' +
        '<p><b>Reason:</b> ' + (leave.reason || "—") + '</p>' +
        '<p><b>Status:</b> <span class="army-badge ' + statusClass + '">' + (leave.status || "Pending") + '</span></p>';
      leaveCards.appendChild(card);
    });
  }

  if (typeof gsap !== "undefined" && gsap.from) {
    gsap.from(".leave-card", { y: 24, opacity: 0, stagger: 0.12, duration: 0.5, ease: "power2.out" });
  }
})();
