// admin-login.js
import { API_BASE } from "../apiBase.js";

const form = document.getElementById("adminLoginForm");

if (form) {
form.addEventListener("submit", async (e) => {
e.preventDefault();

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;

if (!email || !password) {
  alert("Email dan password tidak boleh kosong.");
  return;
}

try {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.message || "Login gagal.");
    return;
  }

  const user = result.user;

  // Pastikan ini admin
  if (user.role_id !== 1) {
    alert("Akses ditolak. Ini bukan akun admin.");
    return;
  }

  // Simpan sesi admin
  localStorage.setItem("user", JSON.stringify(user));

  // Masuk ke dashboard admin
  window.location.href = "admin.html";

} catch (err) {
  console.error(err);
  alert("Gagal terhubung ke server.");
}
});
}
