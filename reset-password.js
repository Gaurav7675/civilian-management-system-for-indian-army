(function() {
  var form = document.getElementById("resetForm");
  var userIdInput = document.getElementById("resetUserId");
  var newPassInput = document.getElementById("newPassword");
  var btnGen = document.getElementById("btnGenerate");

  if (btnGen) {
    btnGen.addEventListener("click", function() {
      if (typeof generatePassword === "function") {
        newPassInput.value = generatePassword();
      } else {
        newPassInput.value = "P" + Math.random().toString(36).slice(2, 8).toUpperCase();
      }
    });
  }

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var id = userIdInput.value.trim();
      var newPass = newPassInput.value;
      if (!id) {
        alert("Enter User ID.");
        return;
      }
      if (!newPass) {
        alert("Enter a new password or click Generate Password.");
        return;
      }
      var u = typeof DB !== "undefined" && DB.users && DB.users.find(function(x) { return x.id === id || x.id.toUpperCase() === id.toUpperCase(); });
      if (!u) {
        alert("User not found with this ID.");
        return;
      }
      if (typeof updateUser !== "undefined") {
        updateUser(u.id, { password: newPass });
        alert("Password updated successfully. You can login with the new password.");
        window.location.href = "login.html";
      } else {
        alert("Password reset not available.");
      }
    });
  }
})();
