(function() {
  var form = document.getElementById("genSalaryForm");
  var empSelect = document.getElementById("empSelect");
  var monthInput = document.getElementById("month");
  var deductionsInput = document.getElementById("deductions");
  var preview = document.getElementById("preview");

  if (typeof DB !== "undefined" && DB.users) {
    var soldiers = DB.users.filter(function(u) { return u.role === "soldier"; });
    soldiers.forEach(function(u) {
      var opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = u.name + " (" + u.rank + ")";
      empSelect.appendChild(opt);
    });
  }

  function updatePreview() {
    if (!preview || typeof calculateSalaryFromStructure !== "function") return;
    var uid = empSelect.value;
    var u = DB.users.find(function(x) { return x.id === uid; });
    if (!u) return;
    var ded = parseFloat(deductionsInput.value) || 0;
    var calc = calculateSalaryFromStructure(u.rank, ded);
    preview.innerHTML = "<p><b>Preview:</b> Basic &#8377;" + calc.basic.toLocaleString() + " + DA &#8377;" + calc.da.toLocaleString() + " + HRA &#8377;" + calc.hra.toLocaleString() + " + Allow &#8377;" + calc.allowances.toLocaleString() + " - Ded &#8377;" + calc.deductions.toLocaleString() + " = <strong>Net &#8377;" + calc.net.toLocaleString() + "</strong></p>";
  }

  if (empSelect) empSelect.addEventListener("change", updatePreview);
  if (deductionsInput) deductionsInput.addEventListener("input", updatePreview);

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var uid = empSelect.value;
      var u = DB.users.find(function(x) { return x.id === uid; });
      var month = monthInput.value.trim();
      var ded = parseFloat(deductionsInput.value) || 0;
      if (!u || !month) { alert("Select employee and month."); return; }
      var calc = calculateSalaryFromStructure(u.rank, ded);
      var sal = {
        userId: u.id,
        name: u.name,
        rank: u.rank,
        month: month,
        basic: calc.basic,
        da: calc.da,
        hra: calc.hra,
        allowances: calc.allowances,
        deductions: calc.deductions,
        net: calc.net
      };
      if (typeof addSalary === "function") {
        addSalary(sal);
        alert("Salary slip generated and saved.");
        form.reset();
        preview.innerHTML = "";
      }
    });
  }
})();
