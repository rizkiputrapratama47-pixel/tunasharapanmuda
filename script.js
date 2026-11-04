/* =====================================================
   DATA KARTU
   Susunan baris: 1 - 1 - 4 (ikuti jumlah isi array "people").
   - image : letakkan gambar desainmu (rasio 4:3) di folder images/
             contoh: images/ketua.jpg, lalu tulis "images/ketua.jpg"
   - song.file : (opsional) file MP3 di folder audio/, contoh "audio/ketua.mp3".
                 Kalau dikosongkan, lagu dibuat otomatis dari "notes".
   ===================================================== */
const ORG_TIERS = [
  { people: [
    { role: "Pembina", name: "Bapak Hartono",
      image: "images/pembina.jpg",
      info: "Mendampingi dan memberi arahan kegiatan. Menjadi penghubung pengurus dengan pemerintah kelurahan.",
      song: { title: "Fajar di Kampung", file: "", bpm: 76, wave: "sine",
        notes: "E4:1 G4:1 A4:2 G4:1 E4:1 D4:2 E4:1 G4:1 A4:1 C5:1 B4:2 A4:2 G4:1 E4:1 D4:1 E4:1 C4:4" } }
  ] },
  { people: [
    { role: "Ketua", name: "Rizki Putra Pratama",
      image: "images/ketua.png",
      info: "Memimpin rapat dan menetapkan arah program tahunan. Mewakili Karang Taruna dalam acara warga.",
      song: { title: "Hindia - Berdansalah, Karir Tak Ada Artinya", file: "audio/ketua.mp3", start: 65.1 , end: 95, bpm: 108, wave: "triangle",
        notes: "C4:1 E4:1 G4:1 E4:1 A4:1 G4:1 E4:2 D4:1 E4:1 G4:1 A4:1 C5:2 G4:2" } }
  ] },
  { people: [
    { role: "Wakil Ketua", name: "Sinta Maharani",
      image: "images/wakil-ketua.png",
      info: "Menggantikan ketua saat berhalangan dan mengawasi jadwal kegiatan semua seksi.",
      song: { title: "Hindia - Cincin", file: "audio/wakil-ketua.mp3", start: 65 , bpm: 96, wave: "square", gain: 0.55,
        notes: "D4:1 F4:1 A4:1 F4:1 G4:1 A4:1 C5:2 A4:1 G4:1 F4:1 D4:1 E4:2 D4:2" } },
    { role: "Sekretaris", name: "Anisa Rahmawati",
      image: "images/sekretaris.jpg",
      info: "Mencatat notulen, mengelola surat, dan menyimpan arsip serta data anggota.",
      song: { title: "Catatan Senja", file: "", bpm: 88, wave: "sine",
        notes: "A3:1 C4:1 E4:2 D4:1 C4:1 A3:2 G3:1 A3:1 C4:1 D4:1 E4:3 R:1" } },
    { role: "Bendahara", name: "Fajar Nugroho",
      image: "images/bendahara.jpg",
      info: "Mengelola kas dan iuran, mencatat pemasukan dan pengeluaran, lalu melapor tiap bulan.",
      song: { title: "Kas Berjalan", file: "", bpm: 120, wave: "triangle",
        notes: "G4:.5 A4:.5 B4:1 D5:1 B4:1 A4:.5 G4:.5 E4:2 G4:.5 A4:.5 B4:1 A4:1 G4:1 D4:2" } },
    { role: "Seksi Humas & Media", name: "Rendi Saputra",
      image: "images/humas.jpg",
      info: "Mengelola media sosial, poster, dan dokumentasi untuk menyebarkan info kegiatan.",
      song: { title: "Kabar Kampung", file: "", bpm: 132, wave: "sawtooth", gain: 0.4,
        notes: "C5:.5 D5:.5 E5:1 C5:1 G4:1 A4:.5 C5:.5 D5:2 E5:.5 G5:.5 E5:1 D5:1 C5:2" } }
  ] }
];

/* =====================================================
   KODE KARTU (tidak perlu diubah untuk menambah gambar)
   ===================================================== */
const tree = document.getElementById("tree");
const bar = document.getElementById("bar");
const nowPlaying = document.getElementById("nowPlaying");
const cards = [];

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function makePlaceholder(p) {
  const box = el("div", "placeholder");
  box.appendChild(el("div", "avatar", p.name.replace(/^(Bapak|Ibu)\s+/, "").charAt(0)));
  box.appendChild(el("div", "role", p.role));
  box.appendChild(el("div", "name", p.name));
  return box;
}

ORG_TIERS.forEach(tier => {
  const row = el("section", "tier");
  row.dataset.count = tier.people.length;

  tier.people.forEach(p => {
    const card = el("button", "card");
    card.type = "button";
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-label", p.role + ": " + p.name + ". Ketuk untuk membalik kartu dan memutar lagu.");

    const inner = el("div", "inner");

    // Depan: gambar (jika file belum ada, tampil pengganti sementara)
    const front = el("div", "face front");
    const img = new Image();
    img.alt = "";
    img.addEventListener("error", () => { img.replaceWith(makePlaceholder(p)); });
    img.src = p.image;
    front.appendChild(img);

    // Belakang: info + lagu
    const back = el("div", "face back");
    back.appendChild(el("div", "role", p.role));
    back.appendChild(el("div", "name", p.name));
    back.appendChild(el("p", "info", p.info));
    const song = el("div", "song");
    const eq = el("div", "eq");
    eq.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 4; i++) eq.appendChild(document.createElement("i"));
    const meta = el("div");
    meta.appendChild(el("b", "", p.song.title));
    meta.appendChild(el("small", "", "Sedang diputar"));
    song.appendChild(eq);
    song.appendChild(meta);
    back.appendChild(song);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    row.appendChild(card);
    cards.push({ card, p });

    card.addEventListener("click", () => toggle(card, p));
  });

  tree.appendChild(row);
});

function setFlipped(card, on) {
  card.classList.toggle("flipped", on);
  card.setAttribute("aria-pressed", on ? "true" : "false");
}

function toggle(card, p) {
  const open = card.classList.contains("flipped");
  cards.forEach(c => { if (c.card !== card) setFlipped(c.card, false); });
  if (open) {
    setFlipped(card, false);
    stopSong();
  } else {
    setFlipped(card, true);
    playSong(p.song);
  }
}

document.getElementById("stopBtn").addEventListener("click", () => {
  cards.forEach(c => setFlipped(c.card, false));
  stopSong();
});

/* =====================================================
   MUSIK
   Jika song.file diisi, file itu diputar berulang.
   Jika kosong, melodi dibuat dengan Web Audio dari song.notes.
   ===================================================== */
const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function noteFreq(name) {
  const m = /^([A-G])(#|b)?(\d)$/.exec(name);
  if (!m) return null;
  const semi = SEMI[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  const midi = 12 * (parseInt(m[3], 10) + 1) + semi;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function parseNotes(str) {
  return str.trim().split(/\s+/).map(tok => {
    const [n, d] = tok.split(":");
    return { f: n === "R" ? null : noteFreq(n), beats: parseFloat(d) };
  });
}

let ctx = null;
let current = null;

function playSong(song) {
  stopSong(true);
  nowPlaying.textContent = "Memutar: " + song.title;
  bar.hidden = false;

  if (song.file) {
    const audio = new Audio(song.file);
    const start = song.start || 0;
    const end = song.end || 0;

    // Lompat ke detik mulai setelah file siap
    audio.addEventListener("loadedmetadata", () => { audio.currentTime = start; }, { once: true });

    // Kembali ke detik mulai saat lagu habis atau mencapai "end"
    const restart = () => { audio.currentTime = start; audio.play(); };
    audio.addEventListener("ended", restart);
    if (end) {
      audio.addEventListener("timeupdate", () => { if (audio.currentTime >= end) restart(); });
  }

  audio.play().catch(() => {
    nowPlaying.textContent = "File lagu tidak ditemukan: " + song.file;
  });
  current = { type: "file", audio };
  return;
}

  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
  } catch (e) { return; }

  const seq = parseNotes(song.notes);
  const beat = 60 / song.bpm;
  const total = seq.reduce((a, n) => a + n.beats, 0) * beat;
  const master = ctx.createGain();
  master.gain.value = 0.16 * (song.gain || 1);
  master.connect(ctx.destination);
  const session = { type: "synth", master, timer: null, stopped: false };
  current = session;

  function tone(freq, start, dur, type, vol) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g);
    g.connect(master);
    o.start(start);
    o.stop(start + dur + 0.05);
  }

  function schedule(t0) {
    let t = t0, beatPos = 0;
    seq.forEach(n => {
      const dur = n.beats * beat;
      if (n.f) {
        tone(n.f, t, dur * 0.95, song.wave, 1);
        if (beatPos % 4 === 0) tone(n.f / 2, t, beat * 2.6, "sine", 0.8);
      }
      t += dur;
      beatPos += n.beats;
    });
  }

  let nextStart = ctx.currentTime + 0.12;
  schedule(nextStart);
  nextStart += total;
  session.timer = setInterval(() => {
    if (session.stopped) return;
    if (nextStart - ctx.currentTime < 1.5) {
      schedule(nextStart);
      nextStart += total;
    }
  }, 400);
}

function stopSong(keepBar) {
  const s = current;
  current = null;
  if (s) {
    if (s.type === "file") {
      s.audio.pause();
    } else {
      s.stopped = true;
      clearInterval(s.timer);
      try {
        s.master.gain.cancelScheduledValues(ctx.currentTime);
        s.master.gain.setValueAtTime(s.master.gain.value, ctx.currentTime);
        s.master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
        setTimeout(() => { try { s.master.disconnect(); } catch (e) {} }, 400);
      } catch (e) {}
    }
  }
  if (!keepBar) bar.hidden = true;
}