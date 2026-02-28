
const STORAGE_KEY = "army_staff_db";

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      DB.users = parsed.users || DB.users;
      DB.leaves = parsed.leaves || DB.leaves;
      DB.salaries = parsed.salaries || DB.salaries;
      DB.transfers = parsed.transfers || DB.transfers;
      DB.battalions = parsed.battalions || DB.battalions;
      DB.salaryStructures = parsed.salaryStructures || DB.salaryStructures;
    }
  } catch (e) {}
}

function saveDB() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      users: DB.users,
      leaves: DB.leaves,
      salaries: DB.salaries,
      transfers: DB.transfers,
      battalions: DB.battalions,
      salaryStructures: DB.salaryStructures
    }));
  } catch (e) {}
}

const DB = {
  users: [
    { id: "ARMY1001", name: "Rahul Singh", role: "soldier", rank: "Sepoy", battalion: "5 Rajput", phone: "9876543210", address: "Jaipur, Rajasthan", password: "s1", email: "rahul@army.mil" },
    { id: "ARMY1023", name: "Vikram Mehta", role: "soldier", rank: "Naik", battalion: "5 Rajput", phone: "9123456789", address: "Delhi", password: "s2", email: "vikram@army.mil" },
    { id: "ARMY2001", name: "Captain Arjun Reddy", role: "lieutenant", rank: "Captain", battalion: "5 Rajput", password: "l1", email: "arjun@army.mil" },
    { id: "ARMY3001", name: "Colonel Rajesh Kumar", role: "colonel", rank: "Colonel", battalion: "HQ", password: "c1", email: "rajesh@army.mil" },
    { id: "ARMY4001", name: "Maj. Finance Sharma", role: "accountant", rank: "Major", password: "a1", email: "sharma@army.mil" },
    { id: "ADMIN001", name: "System Admin", role: "admin", rank: "Brigadier", password: "admin", email: "admin@army.mil" }
  ],
  leaves: [
    { id: "L001", userId: "ARMY1023", type: "Casual Leave", from: "2026-02-01", to: "2026-02-05", reason: "Family function", status: "Approved", requestedAt: "2026-01-28" },
    { id: "L002", userId: "ARMY1023", type: "Medical Leave", from: "2026-03-10", to: "2026-03-12", reason: "Health check-up", status: "Pending", requestedAt: "2026-03-01" },
    { id: "L003", userId: "ARMY1023", type: "Emergency Leave", from: "2026-03-20", to: "2026-03-22", reason: "Family emergency", status: "Rejected", requestedAt: "2026-03-15" },
    { id: "L004", userId: "ARMY1001", type: "Casual Leave", from: "2026-04-01", to: "2026-04-03", reason: "Personal", status: "Pending", requestedAt: "2026-03-25" }
  ],
  salaries: [
    { id: "S001", userId: "ARMY1023", name: "Vikram Mehta", rank: "Naik", month: "March 2026", basic: 28000, da: 11760, hra: 5600, allowances: 2000, deductions: 2500, net: 44860 },
    { id: "S002", userId: "ARMY1001", name: "Rahul Singh", rank: "Sepoy", month: "March 2026", basic: 25000, da: 10500, hra: 5000, allowances: 2000, deductions: 2000, net: 40500 }
  ],
  transfers: [
    { id: "T001", userId: "ARMY1023", fromBattalion: "5 Rajput", toBattalion: "10 Sikh", requestedDate: "2026-02-10", reason: "Family relocation", status: "Forwarded" },
    { id: "T002", userId: "ARMY1023", fromBattalion: "5 Rajput", toBattalion: "7 Grenadiers", requestedDate: "2026-03-05", reason: "Request", status: "Approved" },
    { id: "T003", userId: "ARMY1023", fromBattalion: "5 Rajput", toBattalion: "12 Jat", requestedDate: "2026-04-01", reason: "Preferred unit", status: "Pending" }
  ],
  battalions: [
    { id: "B1", name: "5 Rajput", location: "Jaipur", strength: 850 },
    { id: "B2", name: "10 Sikh", location: "Ferozepur", strength: 920 },
    { id: "B3", name: "7 Grenadiers", location: "Jabalpur", strength: 780 },
    { id: "B4", name: "12 Jat", location: "Bareilly", strength: 810 }
  ],
  salaryStructures: [
    { rank: "Sepoy", basic: 25000, daPercent: 42, hraPercent: 20, allowanceFixed: 2000 },
    { rank: "Naik", basic: 28000, daPercent: 42, hraPercent: 20, allowanceFixed: 2000 },
    { rank: "Havildar", basic: 32000, daPercent: 42, hraPercent: 20, allowanceFixed: 2500 }
  ]
};

loadDB();

function getCurrentUserFromDB() {
  const cu = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!cu) return null;
  return DB.users.find(u => u.id === cu.userid && u.role === cu.role) || null;
}

function getLeavesByUser(userId) {
  return DB.leaves.filter(l => l.userId === userId);
}

function getTransfersByUser(userId) {
  return DB.transfers.filter(t => t.userId === userId);
}

function getSalaryByUser(userId) {
  return DB.salaries.filter(s => s.userId === userId);
}

function getUsersByBattalion(battalion) {
  return DB.users.filter(u => u.role === "soldier" && u.battalion === battalion);
}

function getPendingLeavesForBattalion(battalion) {
  return DB.leaves.filter(l => l.status === "Pending" && getSoldierBattalion(l.userId) === battalion);
}

function getLeavesPendingFinal() {
  return DB.leaves.filter(l => l.status === "Forwarded");
}

function getSoldierBattalion(userId) {
  const u = DB.users.find(x => x.id === userId);
  return u ? u.battalion : null;
}

function addLeave(leave) {
  const id = "L" + String(DB.leaves.length + 1).padStart(3, "0");
  DB.leaves.push({ ...leave, id, status: "Pending", requestedAt: new Date().toISOString().slice(0, 10) });
  saveDB();
  return id;
}

function updateLeaveStatus(leaveId, status) {
  const L = DB.leaves.find(l => l.id === leaveId);
  if (L) { L.status = status; saveDB(); return true; }
  return false;
}

function getPendingTransfersForBattalion(battalion) {
  return DB.transfers.filter(t => t.status === "Pending" && getSoldierBattalion(t.userId) === battalion);
}

function getTransfersPendingFinal() {
  return DB.transfers.filter(t => t.status === "Forwarded");
}

function updateTransferStatus(transferId, status) {
  const T = DB.transfers.find(t => t.id === transferId);
  if (T) { T.status = status; saveDB(); return true; }
  return false;
}

function addUser(user) {
  if (DB.users.some(u => u.id === user.id)) return false;
  DB.users.push(user);
  saveDB();
  return true;
}

function updateUser(id, data) {
  const u = DB.users.find(x => x.id === id);
  if (!u) return false;
  Object.assign(u, data);
  saveDB();
  return true;
}

function deleteUser(id) {
  const i = DB.users.findIndex(x => x.id === id);
  if (i === -1) return false;
  DB.users.splice(i, 1);
  saveDB();
  return true;
}

function addSalary(sal) {
  const id = "S" + String(DB.salaries.length + 1).padStart(3, "0");
  DB.salaries.push({ ...sal, id });
  saveDB();
  return id;
}

function getSalaryStructure(rank) {
  return DB.salaryStructures.find(s => s.rank === rank) || DB.salaryStructures[0];
}

function calculateSalaryFromStructure(rank, deductionsAmount) {
  const s = getSalaryStructure(rank);
  const da = Math.round(s.basic * (s.daPercent || 0) / 100);
  const hra = Math.round(s.basic * (s.hraPercent || 0) / 100);
  const gross = s.basic + da + hra + (s.allowanceFixed || 0);
  const deductions = deductionsAmount || 0;
  return { basic: s.basic, da, hra, allowances: s.allowanceFixed || 0, deductions, net: gross - deductions };
}

function getAllLeaves() { return DB.leaves; }
function getAllTransfers() { return DB.transfers; }
function getAllSalaries() { return DB.salaries; }
function getAllUsers() { return DB.users; }

function generatePassword() {
  return "P" + Math.random().toString(36).slice(2, 8).toUpperCase();
}
