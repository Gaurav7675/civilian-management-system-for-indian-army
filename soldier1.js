(function() {
  var form = document.getElementById("leaveForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
    if (!cu) {
      alert("Session expired. Please login again.");
      window.location.href = "login.html";
      return;
    }
    var type = document.getElementById("leaveType").value;
    var from = document.getElementById("fromDate").value;
    var to = document.getElementById("toDate").value;
    var reason = document.getElementById("reason").value.trim();
    if (!type || !from || !to || !reason) {
      alert("Please fill all fields.");
      return;
    }
    if (typeof addLeave === "function") {
      addLeave({ userId: cu.id, type: type, from: from, to: to, reason: reason });
      alert("Leave request submitted successfully.");
      form.reset();
    } else {
      alert("Leave request submitted.");
      form.reset();
    }
  });
})();
