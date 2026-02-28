(function() {
  var container = document.getElementById("slipContainer");
  if (!container) return;

  var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
  var salaries = (typeof getSalaryByUser === "function" && cu) ? getSalaryByUser(cu.id) : [];

  if (salaries.length === 0) {
    container.innerHTML = '<p class="empty-msg">No salary slip available.</p>';
  } else {
    var latest = salaries[salaries.length - 1];
    var basic = latest.basic || 0, da = latest.da || 0, hra = latest.hra || 0;
    var allowances = latest.allowances || 0, deductions = latest.deductions || 0, net = latest.net || 0;
    container.innerHTML =
      '<div class="slip-card army-card" id="slipCard">' +
      '<h2 class="slip-title">&#128176; Salary Slip</h2>' +
      '<p><strong>Name:</strong> ' + (latest.name || cu.name || "—") + '</p>' +
      '<p><strong>Rank:</strong> ' + (latest.rank || cu.rank || "—") + '</p>' +
      '<p><strong>Month:</strong> ' + (latest.month || "—") + '</p>' +
      '<hr class="slip-hr">' +
      '<p>Basic Pay: &#8377;' + basic.toLocaleString() + '</p>' +
      '<p>DA: &#8377;' + da.toLocaleString() + '</p>' +
      '<p>HRA: &#8377;' + hra.toLocaleString() + '</p>' +
      '<p>Other Allowances: &#8377;' + allowances.toLocaleString() + '</p>' +
      '<p>Deductions: &#8377;' + deductions.toLocaleString() + '</p>' +
      '<hr class="slip-hr">' +
      '<h3 class="net-salary">Net Salary: &#8377;' + net.toLocaleString() + '</h3>' +
      '<button type="button" class="army-btn" onclick="window.print()">Print / Download</button>' +
      '</div>';
  }

  window.printSlip = function() { window.print(); };
})();
