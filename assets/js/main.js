(function () {
  'use strict';

  /* ===== KONFIGURASI ===== */
  var WA_NUMBER = '';                       // isi nomor WA (62xxxxxxxxxx) saat menyusul
  var MAPS_URL  = 'https://www.google.com/maps/place/7%C2%B027\'17.3%22S+109%C2%B004\'09.1%22E/@-7.454793,109.0666084,17z/data=!3m1!4b1!4m4!3m3!8m2!3d-7.454793!4d109.0691833?hl=id&entry=ttu&g_ep=EgoyMDI2MTAyNy4wIKXMDSoASAFQAw%3D%3D';
  var MAPS_COORD = '-7.454793,109.0691833';
  var AKAD_END_TS = Date.parse('2026-11-26T10:00:00+07:00');
  var CAL_URL = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('Akad & Resepsi Desy & Huan') +
    '&dates=20261126T030000Z/20261126T080000Z' +
    '&location=' + encodeURIComponent('-7.454793,109.0691833 (Windunegara RT 01/04, Wangon, Banyumas)');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== NAMA TAMU dari ?to= (textContent, bukan innerHTML) ===== */
  (function guest() {
    var raw = new URLSearchParams(location.search).get('to');
    var name = raw ? raw.replace(/\+/g, ' ').trim() : '';
    $('#guestName').textContent = name || 'Tamu Undangan';
  })();

  /* ===== DELAY: data-delay -> --d ===== */
  $$('[data-delay]').forEach(function (el) { el.style.setProperty('--d', el.dataset.delay + 'ms'); });
  $$('.cover-in').forEach(function (el) { /* sudah pakai style --d di markup */ });

  /* ===== LINK MAPS & KALENDER ===== */
  $('#btnMaps').href = MAPS_URL;
  $('#mapOverlay').href = MAPS_URL;
  $('#btnCalendar').href = CAL_URL;
  $('#mapFrame').src = 'https://maps.google.com/maps?q=' + MAPS_COORD + '&z=16&hl=id&output=embed';

  /* ===== VIDEO COVER: main sekali, freeze di frame akhir ===== */
  var video = $('#coverVideo');
  var lastFrame = 'assets/video/cover-last.jpg';
  var card = $('#coverCard');
  var cardShown = false;
  function showCard() {
    if (cardShown) return;
    cardShown = true;
    $('#cover').classList.add('cover--frozen');
    card.classList.add('is-ready');
  }
  function freeze() {
    try { video.currentTime = Math.max(0, video.duration - 0.05); } catch (e) {}
    video.pause();
    video.setAttribute('poster', lastFrame);
    showCard();
  }
  video.addEventListener('ended', freeze);
  if (reduce) {
    video.removeAttribute('autoplay');
    video.style.display = 'none';
    showCard();
  } else {
    var p = video.play();
    if (p && p.catch) p.catch(function () { video.setAttribute('poster', lastFrame); showCard(); });
    // pengaman: kartu tetap muncul walau event 'ended' tidak datang
    video.addEventListener('loadedmetadata', function () {
      setTimeout(showCard, Math.ceil(video.duration * 1000) + 800);
    });
  }

  /* ===== BUKA UNDANGAN ===== */
  var cover = $('#cover');
  var page = $('#main');
  var music = $('#btnMusic');
  var bgm = $('#bgm');
  var musicOn = false;

  function openInvitation() {
    document.body.classList.remove('is-locked');
    page.setAttribute('aria-hidden', 'false');
    cover.classList.add('is-open');
    setTimeout(function () { cover.classList.add('is-gone'); }, reduce ? 300 : 1800);
    revealOnScroll();
    startMusic();
  }
  $('#btnOpen').addEventListener('click', openInvitation);

  /* ===== MUSIK (opsional; tombol disembunyikan bila file belum ada) ===== */
  var MUSIC_SRC = 'assets/audio/music.mp3';
  /* fetch HEAD gagal di file:// dan membuat musik tidak pernah dimuat; langsung set src */
  bgm.addEventListener('canplay', function () { music.hidden = false; });
  bgm.addEventListener('error', function () { music.hidden = true; });
  bgm.preload = 'auto';
  bgm.src = MUSIC_SRC;
  bgm.load();

  function startMusic() {
    if (!bgm.src) return;
    bgm.volume = 0;
    bgm.play().then(function () {
      musicOn = true; music.classList.add('is-playing');
      var v = 0, t = setInterval(function () {
        v = Math.min(1, v + 0.05); bgm.volume = v; if (v >= 1) clearInterval(t);
      }, 100);
    }).catch(function () {});
  }
  music.addEventListener('click', function () {
    if (musicOn) { bgm.pause(); musicOn = false; music.classList.remove('is-playing'); }
    else { bgm.play().catch(function () {}); musicOn = true; music.classList.add('is-playing'); }
  });

  /* ===== REVEAL saat scroll (sekali) ===== */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 }) : null;

  function revealOnScroll() {
    $$('.reveal').forEach(function (el) {
      if (reduce || !io) el.classList.add('is-in'); else io.observe(el);
    });
  }

  /* ===== COUNTDOWN ===== */
  var cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var diff = AKAD_END_TS - Date.now();
    if (diff <= 0) {
      $('#countdown').hidden = true; $('#cdDone').hidden = false; return;
    }
    var s = Math.floor(diff / 1000);
    cd.d.textContent = pad(Math.floor(s / 86400));
    cd.h.textContent = pad(Math.floor(s % 86400 / 3600));
    cd.m.textContent = pad(Math.floor(s % 3600 / 60));
    cd.s.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* ===== RSVP via WhatsApp ===== */
  var form = $('#rsvpForm');
  var out = $('#rsvpMsgOut');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = $('#rsvpName').value.trim();
    var ucapan = $('#rsvpMsg').value.trim();
    var hadir = (form.querySelector('input[name="hadir"]:checked') || {}).value || 'Hadir';
    if (!nama || !ucapan) {
      out.textContent = 'Mohon isi nama dan ucapan.'; out.hidden = false; return;
    }
    if (!WA_NUMBER) {
      out.textContent = 'Fitur kirim ucapan segera aktif.'; out.hidden = false; return;
    }
    var text = 'Nama: ' + nama + '\nKehadiran: ' + hadir + '\n\nUcapan & doa:\n' + ucapan;
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();
