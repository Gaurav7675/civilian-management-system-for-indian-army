(function() {
  var container = document.getElementById("reportCards");
  var summary = document.getElementById("reportSummary");
  var btnExport = document.getElementById("btnExport");

  function buildReport() {
    var users = typeof getAllUsers === "function" ? getAllUsers() : [];
    var leaves = typeof getAllLeaves === "function" ? getAllLeaves() : [];
    var salaries = typeof getAllSalaries === "function" ? getAllSalaries() : [];
    var transfers = typeof getAllTransfers === "function" ? getAllTransfers() : [];

    var byRole = {};
    users.forEach(function(u) {
      byRole[u.role] = (byRole[u.role] || 0) + 1;
    });
    var pendingLeaves = leaves.filter(function(l) { return l.status === "Pending" || l.status === "Forwarded"; }).length;
    var approvedLeaves = leaves.filter(function(l) { return l.status === "Approved"; }).length;

    if (container) {
      container.innerHTML =
        "<div class=\"stat-card\"><h2>" + users.length + "</h2><p>Total Users</p></div>" +
        "<div class=\"stat-card\"><h2>" + leaves.length + "</h2><p>Leave Requests</p></div>" +
        "<div class=\"stat-card\"><h2>" + salaries.length + "</h2><p>Salary Records</p></div>" +
        "<div class=\"stat-card\"><h2>" + transfers.length + "</h2><p>Transfer Requests</p></div>" +
        "<div class=\"stat-card\"><h2>" + pendingLeaves + "</h2><p>Pending Leaves</p></div>" +
        "<div class=\"stat-card\"><h2>" + approvedLeaves + "</h2><p>Approved Leaves</p></div>";
    }

    var text =
      "ARMY STAFF MANAGEMENT SYSTEM - REPORT\n" +
      "Generated: " + new Date().toLocaleString() + "\n\n" +
      "USERS: " + users.length + " total\n" +
      "  Soldiers: " + (byRole.soldier || 0) + "\n" +
      "  Lieutenants: " + (byRole.lieutenant || 0) + "\n" +
      "  Colonels: " + (byRole.colonel || 0) + "\n" +
      "  Accountants: " + (byRole.accountant || 0) + "\n" +
      "  Admins: " + (byRole.admin || 0) + "\n\n" +
      "LEAVES: " + leaves.length + " total | Pending: " + pendingLeaves + " | Approved: " + approvedLeaves + "\n" +
      "SALARIES: " + salaries.length + " records\n" +
      "TRANSFERS: " + transfers.length + " requests\n";

    if (summary) summary.textContent = text;

    if (btnExport) {
      btnExport.onclick = function() {
        var a = document.createElement("a");
        a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
        a.download = "army-system-report-" + new Date().toISOString().slice(0, 10) + ".txt";
        a.click();
      };
    }
  }

  buildReport();
})();
