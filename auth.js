/**
 * Access control: role check + session validation
 */
(function() {
  "use strict";

  var currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch (e) {}

  var pageRole = document.body.getAttribute("data-rank");

  if (!pageRole) return;

  if (!currentUser || !currentUser.userid || !currentUser.role) {
    window.location.href = "login.html";
    throw new Error("No session");
  }

  if (currentUser.role !== pageRole) {
    alert("Access Denied! Invalid role for this page.");
    window.location.href = "login.html";
    throw new Error("Role mismatch");
  }

  if (typeof window.ArmySecurity !== "undefined" && window.ArmySecurity.validateSession) {
    if (!window.ArmySecurity.validateSession()) {
      throw new Error("Session expired");
    }
    if (window.ArmySecurity.initSessionGuard) {
      window.ArmySecurity.initSessionGuard();
    }
  }

  var ind = document.getElementById("dashboardSecurityIndicator");
  if (!ind && document.body.classList.contains("dashboard")) {
    ind = document.createElement("div");
    ind.id = "dashboardSecurityIndicator";
    ind.className = "security-indicator";
    ind.title = "Session expires after 30 min inactivity";
    ind.textContent = "\uD83D\uDD12 SECURE";
    document.body.appendChild(ind);
  }
})();
