(function() {
  var tbody = document.querySelector("#structureTable tbody");
  if (!tbody) return;
  if (typeof DB === "undefined" || !DB.salaryStructures) {
    tbody.innerHTML = "<tr><td colspan=\"5\">No data.</td></tr>";
    return;
  }
  DB.salaryStructures.forEach(function(s) {
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>" + (s.rank || "—") + "</td><td>&#8377;" + (s.basic || 0).toLocaleString() + "</td><td>" + (s.daPercent || 0) + "%</td><td>" + (s.hraPercent || 0) + "%</td><td>&#8377;" + (s.allowanceFixed || 0).toLocaleString() + "</td>";
    tbody.appendChild(tr);
  });
})();
