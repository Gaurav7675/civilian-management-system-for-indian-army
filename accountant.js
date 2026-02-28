function generateSalary() {
  var users = JSON.parse(localStorage.getItem("users")) || [];
  var salaryHistory = JSON.parse(localStorage.getItem("salaryHistory")) || [];

  const empId = prompt("Enter Employee User ID:");

  const emp = users.find(u => u.userId === empId && u.role === "employee");

  if (!emp) {
    alert("Employee Not Found!");
    return;
  }

  const allowance = 3000;
  const total = (emp.salary || 0) + allowance;

  const record = {
    id: Date.now(),
    userId: emp.userId,
    basic: emp.salary,
    allowance: allowance,
    total: total,
    status: "Generated",
    date: new Date().toLocaleDateString()
  };

  salaryHistory.push(record);
  localStorage.setItem("salaryHistory", JSON.stringify(salaryHistory));

  alert("Salary Generated Successfully!");
  updateCounters();
}

function processPayment() {
  var salaryHistory = JSON.parse(localStorage.getItem("salaryHistory")) || [];

  const salaryId = prompt("Enter Salary Record ID:");

  const record = salaryHistory.find(s => s.id == salaryId);

  if (!record) {
    alert("Salary Record Not Found!");
    return;
  }

  record.status = "Paid";

  localStorage.setItem("salaryHistory", JSON.stringify(salaryHistory));

  alert("Payment Processed!");
  updateCounters();
}

function generateSalarySlip() {
  var salaryHistory = JSON.parse(localStorage.getItem("salaryHistory")) || [];

  const salaryId = prompt("Enter Salary Record ID:");

  const record = salaryHistory.find(s => s.id == salaryId);

  if (!record) {
    alert("Salary Record Not Found!");
    return;
  }

  const output = document.getElementById("output");

  output.innerHTML = `
    <div class="slip">
      <h2>Salary Slip</h2>
      <p>User ID: ${record.userId}</p>
      <p>Basic: ₹${record.basic}</p>
      <p>Allowance: ₹${record.allowance}</p>
      <p>Total: ₹${record.total}</p>
      <p>Status: ${record.status}</p>
      <p>Date: ${record.date}</p>
    </div>
  `;
}

function viewSalaryHistory() {
  var salaryHistory = JSON.parse(localStorage.getItem("salaryHistory")) || [];

  const output = document.getElementById("output");

  if (salaryHistory.length === 0) {
    output.innerHTML = "<p>No Salary History Found</p>";
    return;
  }

  let html = "<h2>Salary History</h2>";

  salaryHistory.forEach(s => {
    html += `
      <div class="record">
        <p>ID: ${s.id}</p>
        <p>User: ${s.userId}</p>
        <p>Total: ₹${s.total}</p>
        <p>Status: ${s.status}</p>
        <hr>
      </div>
    `;
  });

  output.innerHTML = html;
}

function financialReport() {
  var salaryHistory = JSON.parse(localStorage.getItem("salaryHistory")) || [];

  let totalPaid = 0;
  let totalGenerated = 0;

  salaryHistory.forEach(s => {
    totalGenerated += s.total;
    if (s.status === "Paid") {
      totalPaid += s.total;
    }
  });

  const output = document.getElementById("output");

  output.innerHTML = `
    <h2>Financial Report</h2>
    <p>Total Generated: ₹${totalGenerated}</p>
    <p>Total Paid: ₹${totalPaid}</p>
    <p>Pending: ₹${totalGenerated - totalPaid}</p>
  `;
}
