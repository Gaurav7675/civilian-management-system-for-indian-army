(function() {
  var transferCards = document.getElementById("transferCards");
  if (!transferCards) return;

  var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
  var transfers = (typeof getTransfersByUser === "function" && cu) ? getTransfersByUser(cu.id) : [];

  if (transfers.length === 0) {
    transferCards.innerHTML = '<p class="empty-msg">No transfer requests found.</p>';
  } else {
    transfers.forEach(function(t) {
      var card = document.createElement("div");
      card.className = "card army-card transfer-card";
      var statusClass = t.status === "Approved" ? "approved" : t.status === "Rejected" ? "rejected" : "pending";
      card.innerHTML =
        '<h3>Transfer to: ' + (t.toBattalion || t.battalion || "—") + '</h3>' +
        '<p><b>From:</b> ' + (t.fromBattalion || "—") + '</p>' +
        '<p><b>Requested:</b> ' + (t.requestedDate || "—") + '</p>' +
        '<p><b>Status:</b> <span class="army-badge ' + statusClass + '">' + (t.status || "Pending") + '</span></p>';
      transferCards.appendChild(card);
    });
  }

  if (typeof gsap !== "undefined" && gsap.from) {
    gsap.from(".transfer-card", { y: 24, opacity: 0, stagger: 0.12, duration: 0.5, ease: "power2.out" });
  }
})();
