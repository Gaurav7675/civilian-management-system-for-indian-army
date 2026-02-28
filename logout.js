function logout() {
  if (typeof window.ArmySecurity !== "undefined" && window.ArmySecurity.clearSession) {
    window.ArmySecurity.clearSession();
  }
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
