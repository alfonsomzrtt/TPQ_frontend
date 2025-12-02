import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// =====================
//  SUPABASE CLIENT
// =====================
//Konfigurasi Supabase
const SUPABASE_URL = "https://sqvhzvhakivoeqajxowh.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdmh6dmhha2l2b2VxYWp4b3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NTMzNTIsImV4cCI6MjA3NjUyOTM1Mn0.QiDgEH7djJO1-AKQeoeLKw4W8FjeudS77NPZJCHIlfs";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// =====================
// DOM REFS
// =====================
//const listSantri = document.getElementById("santriList");
const selectSantri = document.getElementById("inputSantri");
const inputSurat = document.getElementById("inputSurat");
const inputTanggal = document.getElementById("inputTanggal");
const btnTambah = document.getElementById("btnTambah");
const tabelHafalan = document.getElementById("tabelHafalan");

// Default tanggal hari ini
inputTanggal.value = new Date().toISOString().split("T")[0];


// ===============================
// 1. LOAD SANTRI DARI SUPABASE
// ===============================
let santriSelectSlim; 

async function loadSantri() {
  //listSantri.innerHTML = `<li>Memuat...</li>`;
  selectSantri.innerHTML = `<option>Memuat...</option>`;

  const { data, error } = await supabase
    .from("users")
    .select("id, fullname")
    .eq("role_id", 2)
    .order("fullname", { ascending: true });

  if (error) {
    // listSantri.innerHTML = `<li>Gagal memuat santri.</li>`;
    selectSantri.innerHTML = `<option>Gagal memuat</option>`;
    return;
  }

  // Kosongkan
  // listSantri.innerHTML = "";
  selectSantri.innerHTML = "";

  data.forEach(s => {
    // List kiri
    // const li = document.createElement("li");
    // li.textContent = s.fullname;
    // listSantri.appendChild(li);

    // Dropdown input
    const opt = document.createElement("option");
    opt.value = s.id;            // ID santri
    opt.textContent = s.fullname;
    selectSantri.appendChild(opt);
  });

  // Aktifkan SlimSelect untuk Nama Santri
  if (!santriSelectSlim) { 
    santriSelectSlim = new SlimSelect({
      select: '#inputSantri',
      settings: {
        searchText: 'Tidak ditemukan',
        searchPlaceholder: 'Cari santri...',
        searchHighlight: true,
      }
    })
  }
}



// ===============================
// 2. LOAD HAFALAN DARI DATABASE
// ===============================

// ==== Daftar surat Al-Qur'an (1–114) ====
const daftarSurat = [
  { latin: "Al-Fatihah", arab: "ٱلْفَاتِحَة" },
  { latin: "Al-Baqarah", arab: "ٱلْبَقَرَة" },
  { latin: "Ali 'Imran", arab: "آلِ عِمْرَان" },
  { latin: "An-Nisa'", arab: "ٱلنِّسَاء" },
  { latin: "Al-Ma'idah", arab: "ٱلْمَائِدَة" },
  { latin: "Al-An'am", arab: "ٱلْأَنْعَام" },
  { latin: "Al-A'raf", arab: "ٱلْأَعْرَاف" },
  { latin: "Al-Anfal", arab: "ٱلْأَنْفَال" },
  { latin: "At-Taubah", arab: "ٱلتَّوْبَة" },
  { latin: "Yunus", arab: "يُونُس" },
  { latin: "Hud", arab: "هُود" },
  { latin: "Yusuf", arab: "يُوسُف" },
  { latin: "Ar-Ra'd", arab: "ٱلرَّعْد" },
  { latin: "Ibrahim", arab: "إِبْرَاهِيم" },
  { latin: "Al-Hijr", arab: "ٱلْحِجْر" },
  { latin: "An-Nahl", arab: "ٱلنَّحْل" },
  { latin: "Al-Isra'", arab: "ٱلْإِسْرَاء" },
  { latin: "Al-Kahf", arab: "ٱلْكَهْف" },
  { latin: "Maryam", arab: "مَرْيَم" },
  { latin: "Taha", arab: "طه" },
  { latin: "Al-Anbiya'", arab: "ٱلْأَنْبِيَاء" },
  { latin: "Al-Hajj", arab: "ٱلْحَجّ" },
  { latin: "Al-Mu'minun", arab: "ٱلْمُؤْمِنُون" },
  { latin: "An-Nur", arab: "ٱلنُّور" },
  { latin: "Al-Furqan", arab: "ٱلْفُرْقَان" },
  { latin: "Ash-Shu'ara'", arab: "ٱلشُّعَرَاء" },
  { latin: "An-Naml", arab: "ٱلنَّمْل" },
  { latin: "Al-Qasas", arab: "ٱلْقَصَص" },
  { latin: "Al-Ankabut", arab: "ٱلْعَنْكَبُوت" },
  { latin: "Ar-Rum", arab: "ٱلرُّوم" },
  { latin: "Luqman", arab: "لُقْمَان" },
  { latin: "As-Sajdah", arab: "ٱلسَّجْدَة" },
  { latin: "Al-Ahzab", arab: "ٱلْأَحْزَاب" },
  { latin: "Saba'", arab: "سَبَأ" },
  { latin: "Fatir", arab: "فَاطِر" },
  { latin: "Yasin", arab: "يس" },
  { latin: "As-Saffat", arab: "ٱلصَّافَّات" },
  { latin: "Sad", arab: "ص" },
  { latin: "Az-Zumar", arab: "ٱلزُّمَر" },
  { latin: "Ghafir", arab: "غَافِر" },
  { latin: "Fussilat", arab: "فُصِّلَتْ" },
  { latin: "Asy-Syura", arab: "ٱلشُّورَى" },
  { latin: "Az-Zukhruf", arab: "ٱلزُّخْرُف" },
  { latin: "Ad-Dukhan", arab: "ٱلدُّخَان" },
  { latin: "Al-Jasiyah", arab: "ٱلْجَاثِيَة" },
  { latin: "Al-Ahqaf", arab: "ٱلْأَحْقَاف" },
  { latin: "Muhammad", arab: "مُحَمَّد" },
  { latin: "Al-Fath", arab: "ٱلْفَتْح" },
  { latin: "Al-Hujurat", arab: "ٱلْحُجُرَات" },
  { latin: "Qaf", arab: "قٓ" },
  { latin: "Adz-Dzariyat", arab: "ٱلذَّارِيَات" },
  { latin: "At-Tur", arab: "ٱلطُّور" },
  { latin: "An-Najm", arab: "ٱلنَّجْم" },
  { latin: "Al-Qamar", arab: "ٱلْقَمَر" },
  { latin: "Ar-Rahman", arab: "ٱلرَّحْمَٰن" },
  { latin: "Al-Waqi'ah", arab: "ٱلْوَاقِعَة" },
  { latin: "Al-Hadid", arab: "ٱلْحَدِيد" },
  { latin: "Al-Mujadilah", arab: "ٱلْمُجَادِلَة" },
  { latin: "Al-Hasyr", arab: "ٱلْحَشْر" },
  { latin: "Al-Mumtahanah", arab: "ٱلْمُمْتَحَنَة" },
  { latin: "As-Saff", arab: "ٱلصَّفّ" },
  { latin: "Al-Jumu'ah", arab: "ٱلْجُمُعَة" },
  { latin: "Al-Munafiqun", arab: "ٱلْمُنَافِقُون" },
  { latin: "At-Taghabun", arab: "ٱلتَّغَابُن" },
  { latin: "At-Talaq", arab: "ٱلطَّلَاق" },
  { latin: "At-Tahrim", arab: "ٱلتَّحْرِيم" },
  { latin: "Al-Mulk", arab: "ٱلْمُلْك" },
  { latin: "Al-Qalam", arab: "ٱلْقَلَم" },
  { latin: "Al-Haqqah", arab: "ٱلْحَاقَّة" },
  { latin: "Al-Ma'arij", arab: "ٱلْمَعَارِج" },
  { latin: "Nuh", arab: "نُّوح" },
  { latin: "Al-Jinn", arab: "ٱلْجِنّ" },
  { latin: "Al-Muzzammil", arab: "ٱلْمُزَّمِّل" },
  { latin: "Al-Muddatsir", arab: "ٱلْمُدَّثِّر" },
  { latin: "Al-Qiyamah", arab: "ٱلْقِيَامَة" },
  { latin: "Al-Insan", arab: "ٱلْإِنسَان" },
  { latin: "Al-Mursalat", arab: "ٱلْمُرْسَلَات" },
  { latin: "An-Naba'", arab: "ٱلنَّبَإ" },
  { latin: "An-Nazi'at", arab: "ٱلنَّازِعَات" },
  { latin: "Abasa", arab: "عَبَسَ" },
  { latin: "At-Takwir", arab: "ٱلتَّكْوِير" },
  { latin: "Al-Infitar", arab: "ٱلْإِنْفِطَار" },
  { latin: "Al-Mutaffifin", arab: "ٱلْمُطَفِّفِينَ" },
  { latin: "Al-Insyiqaq", arab: "ٱلْإِنْشِقَاق" },
  { latin: "Al-Buruj", arab: "ٱلْبُرُوج" },
  { latin: "At-Tariq", arab: "ٱلطَّارِق" },
  { latin: "Al-A'la", arab: "ٱلْأَعْلَى" },
  { latin: "Al-Ghashiyah", arab: "ٱلْغَاشِيَة" },
  { latin: "Al-Fajr", arab: "ٱلْفَجْر" },
  { latin: "Al-Balad", arab: "ٱلْبَلَد" },
  { latin: "Asy-Syams", arab: "ٱلشَّمْس" },
  { latin: "Al-Lail", arab: "ٱلَّيْل" },
  { latin: "Adh-Dhuha", arab: "ٱلضُّحَىٰ" },
  { latin: "Al-Insyirah", arab: "ٱلشَّرْح" },
  { latin: "At-Tin", arab: "ٱلتِّين" },
  { latin: "Al-Alaq", arab: "ٱلْعَلَق" },
  { latin: "Al-Qadr", arab: "ٱلْقَدْر" },
  { latin: "Al-Bayyinah", arab: "ٱلْبَيِّنَة" },
  { latin: "Az-Zalzalah", arab: "ٱلزَّلْزَلَة" },
  { latin: "Al-'Adiyat", arab: "ٱلْعَادِيَات" },
  { latin: "Al-Qari'ah", arab: "ٱلْقَارِعَة" },
  { latin: "At-Takatsur", arab: "ٱلتَّكَاثُر" },
  { latin: "Al-'Asr", arab: "ٱلْعَصْر" },
  { latin: "Al-Humazah", arab: "ٱلْهُمَزَة" },
  { latin: "Al-Fil", arab: "ٱلْفِيل" },
  { latin: "Quraisy", arab: "قُرَيْش" },
  { latin: "Al-Ma'un", arab: "ٱلْمَاعُون" },
  { latin: "Al-Kautsar", arab: "ٱلْكَوْثَر" },
  { latin: "Al-Kafirun", arab: "ٱلْكَافِرُون" },
  { latin: "An-Nasr", arab: "ٱلنَّصْر" },
  { latin: "Al-Lahab", arab: "ٱلْمَسَد" },
  { latin: "Al-Ikhlas", arab: "ٱلْإِخْلَاص" },
  { latin: "Al-Falaq", arab: "ٱلْفَلَق" },
  { latin: "An-Nas", arab: "ٱلنَّاس" }
];

const suratMap = {};
daftarSurat.forEach(s => {
  suratMap[s.latin] = s.arab;
});



let suratSelectSlim; 

function loadDaftarSurat() {
  const suratSelect = document.getElementById("inputSurat");
  suratSelect.innerHTML = "";

  daftarSurat.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.latin;        
    opt.textContent = `${s.arab} — ${s.latin} `;
    suratSelect.appendChild(opt);
  });
  
  
  
  //aktifkan SlimSelect sekali saja
  if(!suratSelectSlim) { 
    suratSelectSlim = new SlimSelect({
      select: '#inputSurat', 
      settings: { 
        searchText: 'Tidak ditemukan', 
        searchPlaceholder: 'Cari surat...',
        searchHighlight: true
      }
    })
  }
}

async function loadHafalan() {
  tabelHafalan.innerHTML = `<tr><td colspan="4">Memuat...</td></tr>`;

  const { data, error } = await supabase
    .from("vw_hafalan_with_user")
    .select("*")
    .order("tanggal", { ascending: true });

  if (error) {
    tabelHafalan.innerHTML = `<tr><td colspan="4">Gagal memuat data.</td></tr>`;
    return;
  }

  // Group by nama santri
  const grouped = {};

  data.forEach(row => {
    if (!grouped[row.fullname]) {
      grouped[row.fullname] = [];
    }
    grouped[row.fullname].push(row);   // simpan seluruh row
  });

  tabelHafalan.innerHTML = "";

  let no = 1;
  for (const nama in grouped) {
    const jumlah = grouped[nama].length;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${no++}</td>
      <td>${nama}</td>
      <td>${jumlah} surat</td>
      <td><button class="btn-detail" data-nama="${nama}">Detail</button></td>
    `;

    tabelHafalan.appendChild(tr);
  }

  // attach click event untuk tombol detail
  document.querySelectorAll(".btn-detail").forEach(btn => {
    btn.addEventListener("click", () => {
      const nama = btn.getAttribute("data-nama");
      openDetailHafalan(nama, grouped[nama]);
    });
  });
}



// ===============================
// 3. open detail HAFALAN
// ===============================

function openDetailHafalan(nama, records) {
  document.getElementById("detailNama").textContent = "Nama: " + nama;

  const body = document.getElementById("detailBody");
  body.innerHTML = "";

  let no = 1;
  records.forEach(r => {
    const arab  = suratMap[r.surat] || "—" // fallback kalau nama tidak ditemukan
   
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${no++}</td>
      <td>${arab} — ${r.surat}</td>
      <td>${r.tanggal}</td>
    `;
    body.appendChild(tr);
  });

  const modal = document.getElementById("detailModal");
  
  // tambahkan class show untuk animasi muncul
  modal.style.display = "flex";

  // delay sedikit agar CSS transition jalan
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}


document.getElementById("closeDetail").addEventListener("click", () => {
  const modal = document.getElementById("detailModal");
  modal.classList.remove("show");

  setTimeout(() => {
    modal.style.display = "none";
  }, 350); // samakan dengan transition

    document.getElementById("detailModal").style.display = "none";
});




// ===============================
// 3. TAMBAH DATA HAFALAN
// ===============================
btnTambah.addEventListener("click", async () => {
  const user_id = selectSantri.value;
  const surat = inputSurat.value.trim();
  const tanggal = inputTanggal.value;

  if (!user_id) {
    alert("Santri belum dipilih.");
    return;
  }

  if (!surat) {
    alert("Nama surat tidak boleh kosong.");
    return;
  }

  const { error } = await supabase
    .from("hafalan")
    .insert([
      {
        user_id,
        surat,
        tanggal
      }
    ]);

  if (error) {
    alert("Gagal menyimpan: " + error.message);
    return;
  }

  // Bersihkan input
  inputSurat.value = "";

  // Refresh tabel
  loadHafalan();
  alert("Hafalan berhasil ditambahkan.");
});

flatpickr("#inputTanggal", {
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "d M Y",
  allowInput: false,
  static: true,
});


// ===============================
// 4. INITIAL LOAD
// ===============================
loadSantri();
loadHafalan();
loadDaftarSurat(); 
