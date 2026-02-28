/* GSAP ENTRY */
if (typeof gsap !== 'undefined' && gsap.from) {
  gsap.from(".sidebar", {
    x: -200,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  });
}


/* Sidebar Toggle */
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

if (toggleBtn && sidebar) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
}

/* Animated Counters */
document.querySelectorAll(".counter").forEach(counter => {
  const target = parseInt(counter.dataset.target, 10) || 0;
  let count = 0;

  const update = () => {
    if (target > 0 && count < target) {
      const step = Math.max(1, Math.ceil(target / 40));
      count += step;
      if (count > target) count = target;
      counter.innerText = count;
      requestAnimationFrame(update);
    } else {
      counter.innerText = target;
    }
  };
  update();
});

/* Active Menu */
document.querySelectorAll(".menu li").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".menu li.active")?.classList.remove("active");
    item.classList.add("active");
  });
});
const salaryForm = document.getElementById("salaryForm");

if (salaryForm) {
  const basic = document.getElementById("basicSalary");
  const allowances = document.getElementById("allowances");
  const deductions = document.getElementById("deductions");
  const netSalary = document.getElementById("netSalary");
  const employeeName = document.getElementById("employeeName");

  salaryForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const salaryData = {
      employee: employeeName ? employeeName.value : "",
      basic: parseFloat(basic?.value) || 0,
      allowances: parseFloat(allowances?.value) || 0,
      deductions: parseFloat(deductions?.value) || 0,
      net: parseFloat(netSalary?.value) || 0,
      date: new Date().toLocaleDateString()
    };

    let salaries = JSON.parse(localStorage.getItem("salaries")) || [];
    salaries.push(salaryData);
    localStorage.setItem("salaries", JSON.stringify(salaries));

    alert("Salary Saved Successfully!");

    salaryForm.reset();
    if (netSalary) netSalary.value = "";
  });

  if (basic && allowances && deductions && netSalary) {
    function calculateSalary() {
      const basicVal = parseFloat(basic.value) || 0;
      const allowanceVal = parseFloat(allowances.value) || 0;
      const deductionVal = parseFloat(deductions.value) || 0;

      netSalary.value = basicVal + allowanceVal - deductionVal;
    }

    basic.addEventListener("input", calculateSalary);
    allowances.addEventListener("input", calculateSalary);
    deductions.addEventListener("input", calculateSalary);
  }
}
function loadSalaryHistory() {

  let salaries = JSON.parse(localStorage.getItem("salaries")) || [];

  const tableBody = document.querySelector("#historyTable tbody");
  
  if (!tableBody) return;

  tableBody.innerHTML = "";

  salaries.forEach(function(salary) {

    const row = `
      <tr>
        <td>${salary.employee}</td>
        <td>${salary.basic}</td>
        <td>${salary.allowances}</td>
        <td>${salary.deductions}</td>
        <td>${salary.net}</td>
        <td>${salary.date}</td>
      </tr>
    `;

    tableBody.innerHTML += row;

  });
}

