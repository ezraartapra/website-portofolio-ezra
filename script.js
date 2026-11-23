/* =====================================================
   DATA KARYA
   Tambah karya baru dengan menambah satu baris di array "works".
   category: "digital" | "cetak" | "branding"
   (nama kategori bisa diubah di objek "categories")
===================================================== */
const categories = {
  digital: "Desain Digital",
  cetak: "Desain Cetak",
  branding: "Desain Branding",
};

const works = [
  { category: "digital", title: "Feed Media Sosial: Promosi Kopi", image: "assets/desain_1.png", description: "Desain promosi kopi" },
  { category: "digital", title: "Feed Media Sosial: Motivasi", image: "assets/desain_3.png", description: "Desain tema motivasi" },
  { category: "digital", title: "Feed Media Sosial: Travel", image: "assets/desain_4.png", description: "Desain tema travel" },
  { category: "digital", title: "Feed Media Sosial: Fashion", image: "assets/desain_5.png", description: "Desain promosi produk fashion" },
  { category: "digital", title: "Feed Media Sosial: Acara", image: "assets/desain_6.png", description: "Desain promosi acara" },

  { category: "cetak", title: "Desain Totebag", image: "assets/desain_totebag.png", description: "Desain siap cetak untuk totebag" },
  { category: "cetak", title: "Hasil Cetak Totebag", image: "assets/fotototebag.jpg", description: "Totebag setelah dicetak" },
  { category: "cetak", title: "Desain Kaos", image: "assets/desainukk.jpg", description: "Desain siap cetak untuk kaos" },
  { category: "cetak", title: "Hasil Cetak Kaos", image: "assets/potobaju.jpg", description: "Kaos setelah dicetak" },

  { category: "branding", title: "Logo BUSARA", image: "assets/logobusara.jpg", description: "Logo brand dengan inisial huruf B" },
  { category: "branding", title: "Logo EXORA", image: "assets/logofix.jpg", description: "Logo brand dengan inisial huruf E" },
];

/* =====================================================
   TEMA TERANG / GELAP (tema awal diatur di <head>)
===================================================== */
const root = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('portfolio-theme', next); } catch (e) {}
});

/* =====================================================
   NAVIGASI MOBILE + MENU AKTIF SAAT SCROLL
===================================================== */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
function setNav(open){
  nav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
}
navToggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));

const navLinks = [...nav.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting){
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['profil', 'karya', 'kontak'].forEach(id => spy.observe(document.getElementById(id)));

/* =====================================================
   GALERI + FILTER
===================================================== */
const grid = document.getElementById('grid');
const filters = document.getElementById('filters');
let current = 'all';
const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
let visible = [];

function renderFilters(){
  const keys = ['all', ...Object.keys(categories)];
  keys.forEach(key => {
    const count = key === 'all' ? works.length : works.filter(w => w.category === key).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.dataset.key = key;
    btn.textContent = (key === 'all' ? 'Semua' : categories[key]) + ' (' + count + ')';
    btn.addEventListener('click', () => { current = key; renderGrid(); });
    filters.appendChild(btn);
  });
}

function renderGrid(){
  filters.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.key === current)));
  visible = works.filter(w => current === 'all' || w.category === current);
  grid.replaceChildren();
  visible.forEach((w, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'work';
    btn.setAttribute('aria-label', 'Buka karya: ' + w.title);
    btn.style.setProperty('--i', i);

    const thumb = document.createElement('span');
    thumb.className = 'thumb';
    const img = document.createElement('img');
    img.src = w.image;
    img.alt = w.title;
    img.loading = 'lazy';
    img.onerror = () => { btn.classList.add('broken'); thumb.textContent = 'Gambar belum tersedia'; };
    const view = document.createElement('span');
    view.className = 'view';
    view.textContent = 'Lihat karya';
    thumb.append(img, view);

    const cap = document.createElement('span');
    cap.className = 'cap';
    const b = document.createElement('b');
    b.textContent = w.title;
    const s = document.createElement('small');
    s.textContent = categories[w.category];
    cap.append(b, s);

    btn.append(thumb, cap);
    btn.addEventListener('click', () => {
      if (!btn.classList.contains('broken')) openLightbox(i);
    });
    if (finePointer){
      btn.addEventListener('pointermove', e => {
        const r = thumb.getBoundingClientRect();
        thumb.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 10 + 'deg');
        thumb.style.setProperty('--rx', -((e.clientY - r.top) / r.height - .5) * 10 + 'deg');
      });
      btn.addEventListener('pointerleave', () => {
        thumb.style.setProperty('--rx', '0deg');
        thumb.style.setProperty('--ry', '0deg');
      });
    }
    grid.appendChild(btn);
  });
}

/* =====================================================
   LIGHTBOX (sebelumnya/berikutnya, keyboard, geser di HP)
===================================================== */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let idx = 0, lastFocus = null;

function showLightbox(i){
  idx = (i + visible.length) % visible.length;
  const w = visible[idx];
  lbImg.src = w.image;
  lbImg.alt = w.title;
  document.getElementById('lbTitle').textContent = w.title;
  document.getElementById('lbDesc').textContent = w.description || '';
  document.getElementById('lbCount').textContent = (idx + 1) + ' / ' + visible.length;
}
function openLightbox(i){
  lastFocus = document.activeElement;
  showLightbox(i);
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  document.getElementById('lbClose').focus();
}
function closeLightbox(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
  lbImg.src = '';
  if (lastFocus) lastFocus.focus();
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbBg').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => showLightbox(idx - 1));
document.getElementById('lbNext').addEventListener('click', () => showLightbox(idx + 1));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLightbox(); setNav(false); }
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') showLightbox(idx - 1);
  if (e.key === 'ArrowRight') showLightbox(idx + 1);
});

let touchX = null;
lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showLightbox(idx + (dx < 0 ? 1 : -1));
  touchX = null;
});

/* =====================================================
   INISIALISASI
===================================================== */
/* marquee software: gandakan isi agar putarannya mulus */
const track = document.getElementById('track');
const half = track.innerHTML.repeat(3);
track.innerHTML = half + half;

/* garis bergelombang di bawah judul + marquee muncul saat di-scroll */
const SQUIG = '<svg class="squig" viewBox="0 0 120 14" aria-hidden="true"><path pathLength="1" d="M2 9 Q12 1 22 9 T42 9 T62 9 T82 9 T102 9 T118 9"/></svg>';
const reveal = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); reveal.unobserve(e.target); }
  });
}, { threshold: .3 });
document.querySelectorAll('.section h2').forEach(h => { h.insertAdjacentHTML('beforeend', SQUIG); reveal.observe(h); });
reveal.observe(document.querySelector('.marquee'));

/* garis progres scroll di atas halaman */
const progress = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
}, { passive: true });

/* teks peran yang mengetik bergantian */
const typed = document.getElementById('typed');
const words = ['grafis', 'feed media sosial', 'desain cetak', 'logo brand'];
if (!matchMedia('(prefers-reduced-motion: reduce)').matches){
  let wi = 0, ci = words[0].length, deleting = true;
  const tick = () => {
    const w = words[wi];
    ci += deleting ? -1 : 1;
    typed.textContent = w.slice(0, ci);
    let delay = deleting ? 45 : 90;
    if (!deleting && ci === w.length){ deleting = true; delay = 1600; }
    else if (deleting && ci === 0){ deleting = false; wi = (wi + 1) % words.length; delay = 300; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2000);
}

renderFilters();
renderGrid();
document.getElementById('year').textContent = new Date().getFullYear();
