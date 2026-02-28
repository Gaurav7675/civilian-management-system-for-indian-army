(function() {
  var tbody = document.querySelector("#usersTable tbody");
  var btnAdd = document.getElementById("btnAddUser");
  var popup = document.getElementById("userPopup");
  var popupTitle = document.getElementById("popupTitle");
  var editUserId = document.getElementById("editUserId");
  var userId = document.getElementById("userId");
  var userName = document.getElementById("userName");
  var userRole = document.getElementById("userRole");
  var userRank = document.getElementById("userRank");
  var userBattalion = document.getElementById("userBattalion");
  var userPassword = document.getElementById("userPassword");
  var btnSave = document.getElementById("btnSaveUser");

  if (typeof DB !== "undefined" && DB.battalions) {
    DB.battalions.forEach(function(b) {
      var opt = document.createElement("option");
      opt.value = b.name;
      opt.textContent = b.name;
      userBattalion.appendChild(opt);
    });
    var hq = document.createElement("option");
    hq.value = "HQ";
    hq.textContent = "HQ";
    userBattalion.appendChild(hq);
  }

  function render() {
    if (!tbody) return;
    tbody.innerHTML = "";
    var list = typeof getAllUsers === "function" ? getAllUsers() : [];
    list.forEach(function(u) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + (u.id || "—") + "</td>" +
        "<td>" + (u.name || "—") + "</td>" +
        "<td>" + (u.role || "—") + "</td>" +
        "<td>" + (u.rank || "—") + "</td>" +
        "<td>" + (u.battalion || "—") + "</td>" +
        "<td><button type=\"button\" class=\"army-btn secondary small\" data-edit=\"" + (u.id || "") + "\">Edit</button> " +
        "<button type=\"button\" class=\"army-btn secondary small\" data-delete=\"" + (u.id || "") + "\">Delete</button></td>";
      tbody.appendChild(tr);
    });
  }

  var main = document.querySelector(".army-main");
  if (main) {
    main.addEventListener("click", function(e) {
      var edit = e.target.getAttribute("data-edit");
      var del = e.target.getAttribute("data-delete");
      if (edit) { openEdit(edit); }
      if (del) { if (confirm("Delete user " + del + "?")) { if (typeof deleteUser === "function") deleteUser(del); render(); } }
    });
  }

  function openEdit(id) {
    var u = DB.users.find(function(x) { return x.id === id; });
    if (!u) return;
    popupTitle.textContent = "Edit User";
    editUserId.value = id;
    userId.value = u.id;
    userId.readOnly = true;
    userName.value = u.name || "";
    userRole.value = u.role || "soldier";
    userRank.value = u.rank || "";
    userBattalion.value = u.battalion || "";
    userPassword.value = "";
    userPassword.placeholder = "Leave blank to keep current";
    popup.style.display = "flex";
  }

  function openAdd() {
    popupTitle.textContent = "Add User";
    editUserId.value = "";
    userId.value = "";
    userId.readOnly = false;
    userName.value = "";
    userRole.value = "soldier";
    userRank.value = "";
    userBattalion.value = "";
    userPassword.value = "";
    userPassword.placeholder = "Required for new user";
    popup.style.display = "flex";
  }

  if (btnAdd) btnAdd.addEventListener("click", openAdd);

  if (btnSave) {
    btnSave.addEventListener("click", function() {
      var id = userId.value.trim();
      var name = userName.value.trim();
      var role = userRole.value;
      var rank = userRank.value.trim();
      var battalion = userBattalion.value || (role === "soldier" ? "5 Rajput" : "HQ");
      var password = userPassword.value;
      if (!id || !name) { alert("ID and Name required."); return; }
      if (editUserId.value) {
        if (typeof updateUser === "function") {
          var data = { name: name, role: role, rank: rank, battalion: battalion };
          if (password) data.password = password;
          updateUser(editUserId.value, data);
          alert("User updated.");
          popup.style.display = "none";
          render();
        }
      } else {
        if (!password) { alert("Password required for new user."); return; }
        if (DB.users.some(function(u) { return u.id === id; })) { alert("ID already exists."); return; }
        if (typeof addUser === "function") {
          addUser({ id: id, name: name, role: role, rank: rank, battalion: battalion, password: password, phone: "", email: "", address: "" });
          alert("User added.");
          popup.style.display = "none";
          render();
        }
      }
    });
  }

  render();
})();
