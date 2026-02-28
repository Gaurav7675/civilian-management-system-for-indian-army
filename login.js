(function() {
  "use strict";

  var loginForm = document.getElementById("loginForm");
  var otpStep = document.getElementById("otpStep");
  var stepLabel = document.getElementById("stepLabel");
  var loginSubtitle = document.getElementById("loginSubtitle");
  var otpSentMsg = document.getElementById("otpSentMsg");
  var otpDemoHint = document.getElementById("otpDemoHint");
  var btnResendOtp = document.getElementById("btnResendOtp");
  var resendCountEl = document.getElementById("resendCount");
  var btnVerifyOtp = document.getElementById("btnVerifyOtp");
  var btnBackCreds = document.getElementById("btnBackCreds");
  var otpInputs = document.querySelectorAll(".otp-digit");
  var stepDots = document.querySelectorAll(".step-dot");

  var pendingUser = null;
  var pendingRole = null;
  var currentOtp = "";
  var resendTimer = null;

  if (typeof URLSearchParams !== "undefined") {
    var params = new URLSearchParams(window.location.search);
    if (params.get("expired") === "1") {
      var msg = document.getElementById("securityMessage");
      if (msg) { msg.textContent = "Session expired for security. Please log in again."; msg.style.display = "block"; }
    }
  }

  function showStep(step) {
    var isStep1 = step === 1;
    loginForm.style.display = isStep1 ? "block" : "none";
    if (otpStep) otpStep.style.display = isStep1 ? "none" : "block";
    if (stepLabel) stepLabel.textContent = isStep1 ? "Enter credentials" : "OTP verification";
    if (loginSubtitle) loginSubtitle.textContent = isStep1 ? "Step 1: Army ID & Password" : "Step 2: Enter OTP";
    stepDots.forEach(function(d) {
      var n = parseInt(d.getAttribute("data-step"), 10);
      d.classList.toggle("active", n === step);
      d.classList.toggle("done", n < step);
    });
  }

  function generateOtp() {
    var o = "";
    for (var i = 0; i < 6; i++) o += Math.floor(Math.random() * 10);
    return o;
  }

  function sendOtp() {
    currentOtp = generateOtp();
    try { sessionStorage.setItem("army_login_otp", currentOtp); } catch (e) {}
    if (otpDemoHint) otpDemoHint.textContent = "Demo: Your OTP is " + currentOtp;
    if (otpSentMsg) otpSentMsg.textContent = "OTP sent to registered contact. Enter 6-digit code below.";
    otpInputs.forEach(function(inp) { inp.value = ""; });
    if (otpInputs[0]) otpInputs[0].focus();
    startResendTimer();
  }

  function startResendTimer() {
    var sec = 60;
    if (resendTimer) clearInterval(resendTimer);
    if (btnResendOtp) btnResendOtp.disabled = true;
    function tick() {
      sec--;
      if (resendCountEl) resendCountEl.textContent = sec;
      if (sec <= 0) {
        clearInterval(resendTimer);
        if (btnResendOtp) { btnResendOtp.disabled = false; }
        if (resendCountEl) resendCountEl.textContent = "60";
        return;
      }
    }
    tick();
    resendTimer = setInterval(tick, 1000);
  }

  function getOtpValue() {
    var v = "";
    otpInputs.forEach(function(inp) { v += inp.value || ""; });
    return v;
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      var user = document.getElementById("userid").value.trim();
      var pass = document.getElementById("password").value;
      var role = document.getElementById("role").value;

      if (!user || !pass || !role) {
        alert("Please fill all fields.");
        return;
      }

      var found = null;
      if (typeof DB !== "undefined" && DB.users && DB.users.length) {
        found = DB.users.find(function(u) {
          return (u.id === user || u.id.toUpperCase() === user.toUpperCase()) && u.role === role && u.password === pass;
        });
      }
      if (!found && typeof DB !== "undefined") {
        alert("Invalid credentials or role. Check User ID, Password and Role.");
        return;
      }
      if (!found) {
        alert("Invalid credentials.");
        return;
      }

      pendingUser = user;
      pendingRole = role;
      sendOtp();
      showStep(2);
    });
  }

  if (btnVerifyOtp) {
    btnVerifyOtp.addEventListener("click", function() {
      var entered = getOtpValue();
      var stored = "";
      try { stored = sessionStorage.getItem("army_login_otp") || ""; } catch (e) {}
      if (entered.length !== 6) {
        alert("Please enter all 6 digits of OTP.");
        return;
      }
      if (entered !== stored && entered !== currentOtp) {
        alert("Invalid OTP. Please try again or request a new OTP.");
        return;
      }
      try { sessionStorage.removeItem("army_login_otp"); } catch (e) {}
      var userData = { userid: pendingUser, role: pendingRole };
      localStorage.setItem("currentUser", JSON.stringify(userData));
      if (typeof window.ArmySecurity !== "undefined" && window.ArmySecurity.initLoginSession) {
        window.ArmySecurity.initLoginSession();
      }
      window.location.href = pendingRole + ".html";
    });
  }

  if (btnResendOtp) {
    btnResendOtp.addEventListener("click", function() {
      if (this.disabled) return;
      sendOtp();
    });
  }

  if (btnBackCreds) {
    btnBackCreds.addEventListener("click", function() {
      showStep(1);
      pendingUser = null;
      pendingRole = null;
    });
  }

  otpInputs.forEach(function(inp, i) {
    inp.addEventListener("input", function() {
      var v = this.value.replace(/\D/g, "").slice(0, 1);
      this.value = v;
      if (v && i < otpInputs.length - 1) otpInputs[i + 1].focus();
    });
    inp.addEventListener("keydown", function(e) {
      if (e.key === "Backspace" && !this.value && i > 0) otpInputs[i - 1].focus();
    });
    inp.addEventListener("paste", function(e) {
      e.preventDefault();
      var pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
      for (var j = 0; j < pasted.length && j < otpInputs.length; j++) otpInputs[j].value = pasted[j];
      if (pasted.length > 0) otpInputs[Math.min(pasted.length, 5)].focus();
    });
  });
})();
