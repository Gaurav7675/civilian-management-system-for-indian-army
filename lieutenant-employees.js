(function() {
  var tbody = document.querySelector("#employeesTable tbody");
  if (!tbody) return;
  var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
  if (!cu || !cu.battalion) {
    tbody.innerHTML = "<tr><td colspan=\"5\">No battalion assigned or session expired.</td></tr>";
    return;
  }
  var list = typeof getUsersByBattalion === "function" ? getUsersByBattalion(cu.battalion) : [];
  if (list.length === 0) {
    tbody.innerHTML = "<tr><td colspan=\"5\">No soldiers in your battalion.</td></tr>";
    return;
  }
  list.forEach(function(u) {
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>" + (u.id || "—") + "</td><td>" + (u.name || "—") + "</td><td>" + (u.rank || "—") + "</td><td>" + (u.battalion || "—") + "</td><td>" + (u.phone || "—") + "</td>";
    tbody.appendChild(tr);
  });
})();
