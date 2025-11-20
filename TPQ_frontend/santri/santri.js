// Cek apakah user sudah login
const user = JSON.parse(localStorage.getItem("user"));
//katanya sih bisa mencegah browser pake chache
window.onload = () => {
  if (!JSON.parse(localStorage.getItem("user"))) {
    window.location.href = "../login.html";
  }
};

if (!user) {
  // kalau belum login, lempar balik
  window.location.href = "../login.html";
}

// Kalau mau, kamu bisa tampilkan nama user
console.log("Logged in as:", user.fullname);

  // handle logout
  const logoutBtn = document.getElementById("logoutBtn");
  
 
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");          // hapus sesi
    window.location.href = "../login.html";   // kembali ke login
  });
}
  