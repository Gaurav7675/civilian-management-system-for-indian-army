/**
 * Advanced Security - Session, idle timeout, token validation
 */
(function() {
  "use strict";

  var SESSION_TIMEOUT_MS = 30 * 60 * 1000;   // 30 minutes
  var IDLE_TIMEOUT_MS = 15 * 60 * 1000;      // 15 minutes idle
  var SESSION_KEY = "army_session_ts";
  var TOKEN_KEY = "army_session_token";
  var IDLE_KEY = "army_last_activity";
  var WARNING_BEFORE_MS = 2 * 60 * 1000;     // 2 min warning

  function generateToken() {
    var arr = new Uint8Array(24);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(arr);
    } else {
      for (var i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(arr, function(x) { return x.toString(16).padStart(2, "0"); }).join("");
  }

  function now() { return Date.now(); }

  function getSessionTs() {
    try {
      var v = sessionStorage.getItem(SESSION_KEY);
      return v ? parseInt(v, 10) : 0;
    } catch (e) { return 0; }
  }

  function setSessionTs() {
    try {
      sessionStorage.setItem(SESSION_KEY, String(now()));
      sessionStorage.setItem(IDLE_KEY, String(now()));
    } catch (e) {}
  }

  function getToken() {
    try { return sessionStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; }
  }

  function setToken(t) {
    try { sessionStorage.setItem(TOKEN_KEY, t || generateToken()); } catch (e) {}
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(IDLE_KEY);
    } catch (e) {}
  }

  function isSessionExpired() {
    var ts = getSessionTs();
    var idle = 0;
    try { idle = parseInt(sessionStorage.getItem(IDLE_KEY), 10) || 0; } catch (e) {}
    if (now() - ts > SESSION_TIMEOUT_MS) return true;
    if (now() - idle > IDLE_TIMEOUT_MS) return true;
    return false;
  }

  function refreshActivity() {
    try { sessionStorage.setItem(IDLE_KEY, String(now())); } catch (e) {}
  }

  function redirectToLogin() {
    clearSession();
    localStorage.removeItem("currentUser");
    if (window.location.pathname.indexOf("login") === -1 && window.location.pathname.indexOf("register") === -1 && window.location.pathname.indexOf("reset-password") === -1 && window.location.pathname.indexOf("index") === -1) {
      window.location.href = "login.html?expired=1";
    }
  }

  function validateSession() {
    if (!getToken() || !getSessionTs()) return false;
    if (isSessionExpired()) {
      redirectToLogin();
      return false;
    }
    setSessionTs();
    refreshActivity();
    return true;
  }

  function initSessionGuard() {
    var rank = document.body.getAttribute("data-rank");
    if (!rank) return;
    if (!validateSession()) return;
    var checkInterval = setInterval(function() {
      if (isSessionExpired()) {
        clearInterval(checkInterval);
        alert("Session expired for security. Please log in again.");
        redirectToLogin();
      } else {
        refreshActivity();
      }
    }, 60000);

    ["click", "keydown", "mousemove", "scroll"].forEach(function(ev) {
      document.addEventListener(ev, function() { refreshActivity(); }, { passive: true });
    });
  }

  function initLoginSession() {
    var user = localStorage.getItem("currentUser");
    if (user) {
      setToken(generateToken());
      setSessionTs();
    }
  }

  window.ArmySecurity = {
    validateSession: validateSession,
    initSessionGuard: initSessionGuard,
    initLoginSession: initLoginSession,
    clearSession: clearSession,
    setSessionTs: setSessionTs,
    getToken: getToken,
    setToken: setToken,
    refreshActivity: refreshActivity,
    redirectToLogin: redirectToLogin,
    SESSION_TIMEOUT_MS: SESSION_TIMEOUT_MS,
    IDLE_TIMEOUT_MS: IDLE_TIMEOUT_MS
  };
})();
