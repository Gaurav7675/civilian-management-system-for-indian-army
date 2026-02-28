(function() {
  var editBtn = document.getElementById("editBtn");
  var popup = document.getElementById("editPopup");
  var nameField = document.getElementById("editName");
  var phoneField = document.getElementById("editPhone");
  var addressField = document.getElementById("editAddress");

  function loadProfile() {
    var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
    if (!cu) return;
    document.getElementById("pId").textContent = cu.id || "—";
    document.getElementById("pName").textContent = cu.name || "—";
    document.getElementById("pRank").textContent = cu.rank || "—";
    document.getElementById("pBattalion").textContent = cu.battalion || "—";
    document.getElementById("pPhone").textContent = cu.phone || "—";
    document.getElementById("pAddress").textContent = cu.address || "—";
  }

  if (editBtn && popup) {
    editBtn.addEventListener("click", function() {
      var card = document.getElementById("profileCard");
      nameField.value = document.getElementById("pName").textContent;
      phoneField.value = document.getElementById("pPhone").textContent;
      addressField.value = document.getElementById("pAddress").textContent;
      popup.style.display = "flex";
      if (typeof gsap !== "undefined" && gsap.from) {
        gsap.from(".popup-content", { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.out" });
      }
    });
  }

  window.closePopup = function() {
    if (popup) popup.style.display = "none";
  };

  window.saveProfile = function() {
    var cu = typeof getCurrentUserFromDB === "function" ? getCurrentUserFromDB() : null;
    if (cu) {
      cu.name = nameField.value.trim() || cu.name;
      cu.phone = phoneField.value.trim() || cu.phone;
      cu.address = addressField.value.trim() || cu.address;
      document.getElementById("pName").textContent = cu.name;
      document.getElementById("pPhone").textContent = cu.phone;
      document.getElementById("pAddress").textContent = cu.address;
    }
    alert("Profile updated successfully!");
    closePopup();
  };

  loadProfile();
})();
