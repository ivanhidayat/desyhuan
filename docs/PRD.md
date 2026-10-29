# PRD FINAL — Undangan Digital Desy & Huan (web)

Status: FINAL — siap eksekusi
Tanggal: 29 Okt 2026
Folder: E:/PROJECT S/UNDANGAN/DESSY/web

---

## 1. Ringkasan

Gabungkan dua export desain Pencil menjadi satu undangan web mobile-first yang hidup:
1. Halaman awal (cover) memakai VIDEO (sudah dikecilkan: `assets/video/cover.mp4`), menggantikan placeholder foto. Video diputar SEKALI (tanpa loop) lalu BERHENTI/FREEZE di frame terakhir.
2. Tombol "Buka Undangan" membuka isi undangan dengan transisi cover naik ke atas.
3. Animasi masuk per elemen saat di-scroll, meniru POLA animasi referensi
   https://envitto.invisimple.id/s04-i/?to=Tamu+Undangan (hanya pola gerak; teks, gambar, ilustrasi, logo referensi TIDAK disalin).
4. Nama tamu otomatis dari URL `?to=Nama+Tamu`.
5. TANPA bottom nav / tombol menu bawah.
6. Foto `image.png` HANYA dipakai di frame arch "Foto Orang Tua" (section Hormat Kami). Tidak ada foto lain di undangan.

## 2. Kondisi sekarang

| File | Isi |
|---|---|
| `01 · Cover Video · Putih-export.html` | Cover 390x844. Background = foto base64 (placeholder video). Fade putih bawah 35%–70%. Teks: "UNDANGAN TASYAKURAN", "Desy & Huan", host, Kepada Yth., nama tamu statis, catatan, tombol "Buka Undangan". |
| `02 · Undangan · Putih (Klien)-export.html` | Hero ("Video Mempelai" placeholder), Doa, Orang Tua (foto arch), Countdown, Simpan Tanggal, Mempelai, Acara (Tasyakuran, Akad, Resepsi), Denah Lokasi + patokan + tombol Maps, RSVP + daftar ucapan, Penutup. |
| `images/yang mau dipake/image.png` | Foto studio pasangan orang tua (batik + gamis) — HANYA untuk frame arch "Foto Orang Tua". |
| `images/yang mau dipake/main video.mp4` | Video asli (sumber, jangan diubah). |

Teknis export: Tailwind CDN, Google Fonts (Cormorant Garamond + Jost), lebar dikunci 390px, gambar base64 inline, tanpa JS.

## 3. Aset video — SUDAH SELESAI

| File | Spesifikasi | Ukuran |
|---|---|---|
| `images/yang mau dipake/main video.mp4` (asli) | H.264 1080x1920, 30 fps, 4,07 s, AAC, 13,8 Mbps | 7,1 MB |
| `assets/video/cover.mp4` | H.264 High 720x1280, 30 fps, 4,07 s, tanpa audio, ~0,7 Mbps, faststart | 349 KB |
| `assets/video/cover-poster.jpg` | Frame pertama 720x1280 (tampil sebelum video siap) | 56 KB |
| `assets/video/cover-last.jpg` | Frame TERAKHIR 720x1280 (freeze frame; fallback bila autoplay gagal; background Hero isi) | 63 KB |

Pengecilan 95%. Kualitas dicek visual: wajah tajam, tanpa blocking/banding.
WebM tidak dipakai (hasil VP9 justru lebih besar, 364 KB) — cukup satu sumber MP4.

Perintah yang dipakai (untuk diulang bila video diganti):
```
ffmpeg -i "images/yang mau dipake/main video.mp4" -an -vf "scale=720:-2,fps=30" -c:v libx264 -profile:v high -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart assets/video/cover.mp4
ffmpeg -i "images/yang mau dipake/main video.mp4" -frames:v 1 -vf "scale=720:-2" -q:v 3 assets/video/cover-poster.jpg
ffmpeg -sseof -0.1 -i assets/video/cover.mp4 -update 1 -q:v 3 assets/video/cover-last.jpg
```

Komposisi video: bagian atas ~40% kosong (backdrop abu terang), pasangan duduk di area 40%–96% tinggi frame.

## 4. Pola animasi referensi (dicek via Playwright, 390x844)

| Pola | Referensi | Versi kita |
|---|---|---|
| Cover terkunci | Scroll dikunci sampai tombol ditekan | `overflow:hidden` di html/body |
| Buka cover | `top:-100vh` + `opacity:0`, 2500 ms, easeInOutCubic | `transform: translateY(-100%)` + opacity, 1800 ms, `cubic-bezier(.65,0,.35,1)`; lalu `display:none` |
| Reveal | fadeInUp (dominan), fadeInDown, fadeInLeft, fadeInRight, zoomIn, fadeIn | Kelas `reveal` + `data-anim="up|down|left|right|zoom|fade"`, durasi 1,2 s |
| Delay berantai | 400–2000 ms dalam satu section | `data-delay` (ms) |
| Musik | Mulai setelah buka, fade-in 2 s, tombol piringan `rotate 8s linear infinite` | Sama |
| Petunjuk scroll | Panah melayang loop | Chevron "Gulir ke bawah" naik-turun 1,6 s loop |
| Tombol | Efek shrink | `:active { transform: scale(.95) }` |
| Bottom nav sticky | Ada | TIDAK dipakai (keputusan user) |

## 5. Scope

### Masuk
- F1 Satu `index.html` (cover + isi); `assets/css/style.css`, `assets/js/main.js`.
- F2 Cover video (§6).
- F3 Nama tamu dari `?to=` (`+` dan `%20` jadi spasi), default "Tamu Undangan", di-render pakai `textContent`.
- F4 Buka cover: unlock scroll, musik mulai. Video tidak perlu di-pause (sudah freeze di frame akhir); bila masih berjalan, biarkan selesai.
- F5 Reveal per elemen semua section (§7).
- F6 Countdown hidup ke Kamis 26 Nov 2026 10.00 WIB (`2026-11-26T10:00:00+07:00`). Setelah lewat: teks "Acara telah berlangsung".
- F7 "Simpan Tanggal" = link Google Calendar:
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Akad%20%26%20Resepsi%20Desy%20%26%20Huan&dates=20261126T030000Z/20261126T080000Z&location=-7.454793%2C109.0691833%20(Windunegara%20RT%2001%2F04%2C%20Wangon%2C%20Banyumas)`
- F8 Lokasi acara = titik koordinat dari user: 7°27'17.3"S 109°04'09.1"E (`-7.454793, 109.0691833`).
  - Tombol "Buka Google Maps" (`target="_blank" rel="noopener"`) ke link persis dari user:
    `https://www.google.com/maps/place/7%C2%B027'17.3%22S+109%C2%B004'09.1%22E/@-7.454793,109.0666084,17z/data=!3m1!4b1!4m4!3m3!8m2!3d-7.454793!4d109.0691833?hl=id&entry=ttu&g_ep=EgoyMDI2MTAyNy4wIKXMDSoASAFQAw%3D%3D`
    (di HP terbuka langsung di aplikasi Google Maps, bisa langsung "Rute").
  - Peta embed di section Denah: `<iframe loading="lazy" src="https://maps.google.com/maps?q=-7.454793,109.0691833&z=16&hl=id&output=embed">` (tanpa API key), tinggi 220px, sudut membulat sesuai desain. Tap pada peta juga membuka link di atas.
  - Simpan link + koordinat di konstanta `MAPS_URL` dan `MAPS_COORD` di atas `main.js`.
- F9 Tombol musik melayang pojok kanan bawah, berputar saat main. Disembunyikan otomatis bila `assets/audio/music.mp3` tidak ada (cek `audio.onerror`).
- F10 Satu-satunya foto: `image.png` dikompres jadi `assets/img/ortu.jpg` (≤ 200 KB, lebar maks 700 px) untuk frame arch Orang Tua. Gambar base64 dari export (generated*.png) TIDAK dipakai. Ganti manual cukup timpa `ortu.jpg`.
- F11 Responsif: kolom konten maks 430px di tengah; di layar > 430px latar samping krem #F7F6F3.
- F12 `prefers-reduced-motion: reduce`: reveal langsung tampil, transisi cover tanpa gerak (fade 300 ms), video tidak diputar — langsung tampil `cover-last.jpg`.
- F13 RSVP via WhatsApp: form Nama + Ucapan + Hadir/Tidak Hadir, tombol "Kirim Ucapan" membuka `https://wa.me/<NOMOR>?text=...`. Nomor di satu konstanta `WA_NUMBER` di atas `main.js`. Contoh ucapan (Tika, Nano) dihapus.

### Tidak masuk
- Bottom nav / menu bawah.
- Backend RSVP / database ucapan, CMS, generator link tamu, analytics.
- Aset/teks/ilustrasi referensi.

## 6. Cover video

### 6.1 Markup
```
<section id="cover" aria-label="Sampul undangan">
  <video class="cover-video" autoplay muted playsinline preload="auto"
         poster="assets/video/cover-poster.jpg" aria-hidden="true">   <!-- TANPA loop -->
    <source src="assets/video/cover.mp4" type="video/mp4">
  </video>
  <div class="cover-fade-top"></div>
  <div class="cover-head"> eyebrow + nama + host </div>
  <div class="cover-card"> Kepada Yth + nama tamu + catatan + tombol </div>
</section>
```
- Cover `position:fixed; inset:0; height:100svh` (fallback `100vh`), lebar ikut kolom maks 430px.
- Video `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center bottom`.
- Main sekali, TANPA atribut `loop`. Saat `ended`, browser otomatis diam di frame terakhir. Pengaman: di event `ended` set `video.currentTime = video.duration - 0.05` lalu `pause()` (beberapa browser Android kembali ke poster).
- `video.play()` dibungkus `.catch(()=>{})`. Gagal autoplay (hemat daya/hemat data) = ganti `poster` ke `cover-last.jpg` → langsung tampil freeze frame, console bersih.
- Teks cover tetap muncul berurutan selama video jalan (§7); tombol "Buka Undangan" bisa ditekan kapan saja, tidak menunggu video selesai.

### 6.2 Layout cover (FINAL — mengatasi pasangan di bawah frame)
- Blok kepala (eyebrow "UNDANGAN TASYAKURAN", "Desy & Huan", host) di ATAS, safe-zone `padding-top: max(56px, env(safe-area-inset-top) + 32px)`.
- `cover-fade-top`: gradien putih dari atas `#FFFFFF 0% → #FFFFFFCC 18% → #FFFFFF00 38%` agar teks kepala terbaca.
- `cover-card` di bawah: kartu `background: rgba(255,255,255,.72); backdrop-filter: blur(10px); border-radius: 20px; padding: 16px 20px; margin: 0 24px max(28px, env(safe-area-inset-bottom)+16px)`. Isi: Kepada Yth., nama tamu, catatan, tombol hitam pill "Buka Undangan" (desain asli).
- Tinggi kartu ≤ 30% layar supaya pasangan (badan & wajah) tetap terlihat di antara kepala dan kartu.

## 7. Pemetaan animasi

Default: durasi 1,2 s, easing `cubic-bezier(.22,.61,.36,1)`, geser 40px, zoom dari `scale(.85)`. Trigger IntersectionObserver threshold 0.15, sekali (unobserve). Reveal isi undangan baru aktif setelah cover dibuka.

| Section | Elemen | Animasi | Delay (ms) |
|---|---|---|---|
| Cover (on load) | Eyebrow | down | 300 |
| | Nama "Desy & Huan" | zoom | 600 |
| | Host | up | 900 |
| | Kartu tamu | up | 1200 |
| | Tombol Buka | up, lalu pulse halus loop (scale 1→1.04, 2 s) | 1500 |
| Hero (background `cover-last.jpg`, sambungan visual dari freeze frame cover) | Background | zoom-out lambat (`scale 1.08→1`, 6 s) | 0 |
| | Eyebrow / "Undangan" / Info | down / zoom / up | 200 / 500 / 800 |
| | Scroll hint | fade lalu melayang loop | 1200 |
| Doa | Ornamen garis | garis melebar (scaleX 0→1, 0,8 s) | 0 |
| | "Ya Allah," / teks doa | up | 200 / 400 |
| Orang Tua (foto `ortu.jpg` dari `image.png`) | Eyebrow / foto arch / nama / caption | down / zoom / up / up | 0 / 200 / 500 / 700 |
| Countdown | 4 kotak | up stagger | 0 / 150 / 300 / 450 |
| | Simpan Tanggal | zoom | 600 |
| Mempelai | Nama wanita / "dengan" / nama pria | left / zoom / right | 200 / 400 / 600 |
| Acara | Intro | up | 0 |
| | Kartu Tasyakuran / Akad / Resepsi | up (per kartu, trigger sendiri) | 0 |
| Denah | Judul / peta / patokan / tombol | down / zoom / left stagger 150 / up | 0 / 200 / 400+ / 800 |
| RSVP | Judul / form | down / up | 0 / 200 |
| Penutup | Teks / Hormat / Host / Turut / Note | up stagger | 0 / 200 / 400 / 600 / 800 |

## 8. Struktur file

```
web/
  index.html
  assets/
    css/style.css
    js/main.js
    video/cover.mp4, cover-poster.jpg, cover-last.jpg   (SUDAH ADA)
    img/ortu.jpg                           (dari image.png)
    audio/music.mp3                         (diisi manual; opsional)
  docs/PRD.md
  01 · Cover ... .html, 02 · Undangan ... .html   (referensi, jangan dihapus)
  images/                                         (jangan diubah)
```
Tailwind CDN dibuang; layout dikonversi ke CSS biasa. Token: putih #FFFFFF, krem #F7F6F3, emas #B08D4A, teks #1F1E1B / #55524C / #9A958C, tombol #1F1E1B. Font: Cormorant Garamond (italic 500) + Jost (400/600) via Google Fonts `display=swap`.

## 9. Kriteria terima

1. `index.html?to=Bapak+Andi` di 390x844: video cover jalan sekali (muted) lalu diam di frame terakhir (dicek: `video.ended === true` dan frame tidak kembali ke poster awal), nama tamu "Bapak Andi".
2. Tanpa `?to` tampil "Tamu Undangan"; `?to=<script>alert(1)</script>` tampil sebagai teks.
3. Sebelum klik tombol, halaman tidak bisa di-scroll.
4. Klik "Buka Undangan": cover keluar ≤ 2 s, scroll aktif, musik main jika file ada.
4b. Foto `image.png` hanya muncul di frame arch Orang Tua; tidak ada gambar lain di halaman selain video/freeze frame.
5. Semua elemen di §7 muncul beranimasi saat discroll; tidak ada yang tetap tersembunyi setelah scroll sampai bawah.
6. Countdown berdetak tiap detik.
6b. Tombol "Buka Google Maps" membuka titik -7.454793, 109.0691833; iframe peta menampilkan pin di titik yang sama.
7. Wajah pasangan di video cover tidak tertutup teks/kartu di 360x800, 390x844, 430x932.
8. Tanpa scroll horizontal di 360/390/430 px; padding samping teks ≥ 24px.
9. Muatan awal (HTML+CSS+JS+poster+video+font) ≤ 1,5 MB.
10. Tidak ada bottom nav.
11. Reduced-motion: semua konten langsung terlihat.
12. Console 0 error.
Verifikasi: Playwright screenshot 3 viewport (cover, sesudah buka, tiap section) + log console + total bytes.

## 10. Keputusan (terkunci)

| ID | Keputusan |
|---|---|
| D1 | Layout cover: nama di atas, kartu tamu + tombol di bawah (§6.2) |
| D2 | Video cover main sekali, freeze di frame akhir. Hero isi pakai `cover-last.jpg`. `image.png` hanya di frame Orang Tua |
| D3 | RSVP via WhatsApp; nomor MENYUSUL. `WA_NUMBER = ""` di `main.js`; selama kosong, tombol Kirim menampilkan pesan "Fitur kirim ucapan segera aktif" (tidak error) |
| D4 | Tanpa bottom nav |
| D5 | Musik MENYUSUL; tombol musik tersembunyi otomatis sampai `assets/audio/music.mp3` ditaruh (tanpa ubah kode) |
| D6 | Gambar export (generated*.png) tidak dipakai |
| D8 | Lokasi pakai koordinat -7.454793, 109.0691833 + link Google Maps dari user |
| D7 | Output folder statis, siap Vercel/Netlify/GitHub Pages |

## 11. Urutan eksekusi

1. ~~Kecilkan video + poster + freeze frame~~ — SELESAI (§3).
2. Kompres `image.png` jadi `assets/img/ortu.jpg`.
3. Tulis `index.html` + `style.css` (port layout, tanpa Tailwind).
4. Tulis `main.js`: nama tamu, kunci/buka cover, reveal, countdown, kalender, musik, RSVP WA.
5. Terapkan animasi §7.
6. Uji Playwright 3 viewport + console + ukuran muatan.
7. Laporan singkat + path screenshot.
