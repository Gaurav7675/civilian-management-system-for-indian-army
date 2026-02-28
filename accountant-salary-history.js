(function() {
  var tbody = document.querySelector("#historyTable tbody");
  if (!tbody) return;
  var list = typeof getAllSalaries === "function" ? getAllSalaries() : [];
  if (list.length === 0) {
    tbody.innerHTML = "<tr><td colspan=\"5\">No salary records.</td></tr>";
    return;
  }
  list.forEach(function(s) {
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>" + (s.name || "—") + "</td><td>" + (s.rank || "—") + "</td><td>" + (s.month || "—") + "</td><td>&#8377;" + (s.basic || 0).toLocaleString() + "</td><td>&#8377;" + (s.net || 0).toLocaleString() + "</td>";
    tbody.appendChild(tr);
  });
})();
