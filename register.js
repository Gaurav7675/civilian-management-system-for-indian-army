(function() {
  var form = document.getElementById("registerForm");
  var battalionSelect = document.getElementById("regBattalion");
  var pwInput = document.getElementById("regPassword");
  var pwStrength = document.getElementById("pwStrength");
  var pwLabel = document.getElementById("pwStrengthLabel");
  if (!form) return;

  function updatePasswordStrength() {
    if (!pwInput || !pwStrength || !pwLabel) return;
    var p = pwInput.value;
    pwStrength.className = "password-strength";
    if (p.length === 0) { pwLabel.textContent = ""; return; }
    var hasNum = /\d/.test(p);
    var hasLetter = /[a-zA-Z]/.test(p);
    var hasLong = p.length >= 8;
    if (p.length < 6) { pwStrength.classList.add("weak"); pwLabel.textContent = "Too short (min 6)"; pwLabel.style.color = "#b54a4a"; return; }
    if (hasNum && hasLetter && hasLong) { pwStrength.classList.add("strong"); pwLabel.textContent = "Strong"; pwLabel.style.color = "#2d5a27"; return; }
    if (hasNum || hasLetter) { pwStrength.classList.add("medium"); pwLabel.textContent = "Medium (add numbers & letters)"; pwLabel.style.color = "#c9a227"; return; }
    pwStrength.classList.add("weak"); pwLabel.textContent = "Weak"; pwLabel.style.color = "#b54a4a";
  }
  if (pwInput) pwInput.addEventListener("input", updatePasswordStrength);

  if (battalionSelect && typeof DB !== "undefined" && DB.battalions) {
    DB.battalions.forEach(function(b) {
      var opt = document.createElement("option");
      opt.value = b.name;
      opt.textContent = b.name;
      battalionSelect.appendChild(opt);
    });
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var id = document.getElementById("regId").value.trim().toUpperCase();
    var name = document.getElementById("regName").value.trim();
    var role = document.getElementById("regRole").value;
    var rank = document.getElementById("regRank").value.trim();
    var battalion = document.getElementById("regBattalion").value || (role === "soldier" ? "5 Rajput" : "");
    var phone = document.getElementById("regPhone").value.trim();
    var email = document.getElementById("regEmail").value.trim();
    var address = document.getElementById("regAddress").value.trim();
    var password = document.getElementById("regPassword").value;

    if (!id || !name || !role || !rank || !password) {
      alert("Please fill required fields: ID, Name, Role, Rank, Password.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (typeof DB !== "undefined" && DB.users.some(function(u) { return u.id === id; })) {
      alert("This Army ID is already registered.");
      return;
    }

    var user = {
      id: id,
      name: name,
      role: role,
      rank: rank,
      battalion: battalion || (role === "soldier" ? "5 Rajput" : "HQ"),
      phone: phone,
      email: email,
      address: address,
      password: password
    };

    if (typeof addUser !== "undefined" && addUser(user)) {
      alert("Registration successful. You can now login.");
      window.location.href = "login.html";
    } else {
      alert("Registration failed. ID may already exist.");
    }
  });
})();
