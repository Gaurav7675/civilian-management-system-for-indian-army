(function() {
  var tbody = document.querySelector("#leaveRecordsTable tbody");
  if (!tbody) return;
  var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
  if (!cu || !cu.battalion) {
    tbody.innerHTML = "<tr><td colspan=\"5\">No battalion assigned.</td></tr>";
    return;
  }
  var allLeaves = typeof getAllLeaves === "function" ? getAllLeaves() : [];
  var users = typeof DB !== "undefined" ? DB.users : [];
  function getName(uid) {
    var u = users.find(function(x) { return x.id === uid; });
    return u ? u.name : uid;
  }
  function getBattalion(uid) {
    var u = users.find(function(x) { return x.id === uid; });
    return u ? u.battalion : null;
  }
  var battalionLeaves = allLeaves.filter(function(l) { return getBattalion(l.userId) === cu.battalion; });
  if (battalionLeaves.length === 0) {
    tbody.innerHTML = "<tr><td colspan=\"5\">No leave records.</td></tr>";
    return;
  }
  battalionLeaves.forEach(function(l) {
    var tr = document.createElement("tr");
    var cls = l.status === "Approved" ? "approved" : l.status === "Rejected" ? "rejected" : "pending";
    tr.innerHTML = "<td>" + getName(l.userId) + "</td><td>" + (l.type || "—") + "</td><td>" + (l.from || "—") + "</td><td>" + (l.to || "—") + "</td><td><span class=\"army-badge " + cls + "\">" + (l.status || "—") + "</span></td>";
    tbody.appendChild(tr);
  });
})();
