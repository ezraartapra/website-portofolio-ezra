/* =====================================================
   DATA PROYEK / KARYA
   ---------------------------------------------------
   GANTI DI SINI: tambahkan karya kamu pada array "items"
   sesuai kategorinya. Key ("kategori1", "kategori2",
   "kategori3") HARUS SAMA PERSIS dengan atribut
   data-category pada card di index.html.

   Format satu project:
   {
     title: "Nama Project",
     image: "images/projects/nama-file.jpg", // kosongkan "" jika belum ada gambar
     description: "Deskripsi singkat project ini.",
     link: "https://link-project-kamu.com" // atau "#" jika belum ada
   }
===================================================== */
const projectsData = {
  kategori1: {
    title: "Kategori 1",
    items: [
      {
        title: "Desain Feed Media Sosial",
        image: "assets/desain_1.png",
        description: "Desain promosi kopi",
        link: "#",
      },
            {
        title: "Desain Feed Media Sosial",
        image: "assets/desain_3.png",
        description: "Desain tema motivasi",
        link: "#",
      },
            {
        title: "Desain Feed Media Sosial",
        image: "assets/desain_4.png",
        description: "Desain tema travel",
        link: "#",
      },
            {
        title: "Desain Feed Media Sosial",
        image: "assets/desain_5.png",
        description: "Desain promosi produk fashion",
        link: "#",
      },
            {
        title: "Desain Feed Media Sosial",
        image: "assets/desain_6.png",
        description: "Desain promosi acara",
        link: "#",
      },
      // TODO: tambahkan project kategori 1 di sini, contoh:
      // { title: "Project A", image: "images/projects/kategori1-1.jpg", description: "Deskripsi project A.", link: "#" },
    ]
  },
  kategori2: {
    title: "Kategori 2",
    items: [
      {
        title: "Desain siap cetak",
        image: "assets/desain_totebag.png",
        description: "Desain untuk Totebag",
        link: "#",
      },
      {
        title: "Sesudah dicetak",
        image: "assets/fotototebag.jpg",
        description: "Hasil Karya Totebag",
        link: "#",
      },
      {
        title: "Desain siap cetak",
        image: "assets/desainukk.jpg",
        description: "Desain untuk Kaos",
        link: "#",
      },
      {
        title: "Sesudah dicetak",
        image: "assets/potobaju.jpg",
        description: "Desain untuk Totebag",
        link: "#",
      },// TODO: tambahkan project kategori 2 di sini
    ]
  },
  kategori3: {
    title: "Kategori 3",
    items: [
      {
        title: "Logo Brand BUSARA",
        image: "assets/logobusara.jpg",
        description: "Logo untuk branding dengan inisial huruf B",
        link: "#",
      },
      {
        title: "Logo Brand EXORA",
        image: "assets/logofix.jpg",
        description: "Logo untuk branding dengan inisial huruf e",
        link: "#",
      },
      // TODO: tambahkan project kategori 3 di sini
    ]
  }
};

/* =====================================================
   TEMA TERANG / GELAP
===================================================== */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme){
  root.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

// Muat tema tersimpan, atau ikuti preferensi sistem
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme){
  applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches){
  applyTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* =====================================================
   NAVIGASI (hamburger -> 4 menu)
===================================================== */
const navToggle = document.getElementById('navToggle');
const navPanel = document.getElementById('navPanel');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-link');

function openNav(){
  navPanel.classList.add('is-open');
  navOverlay.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navPanel.setAttribute('aria-hidden', 'false');
}
function closeNav(){
  navPanel.classList.remove('is-open');
  navOverlay.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navPanel.setAttribute('aria-hidden', 'true');
}

navToggle.addEventListener('click', () => {
  const isOpen = navPanel.classList.contains('is-open');
  isOpen ? closeNav() : openNav();
});
navOverlay.addEventListener('click', closeNav);
navLinks.forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

/* =====================================================
   MODAL KARYA / PROYEK
===================================================== */
const modal = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalGrid = document.getElementById('modalGrid');
const categoryCards = document.querySelectorAll('.category-card');

function renderProjects(categoryKey){
  const category = projectsData[categoryKey];
  if (!category) return;

  modalTitle.textContent = category.title;
  modalGrid.innerHTML = '';

  if (!category.items.length){
    modalGrid.innerHTML = '<p class="modal-empty">Belum ada karya yang ditambahkan untuk kategori ini.</p>';
    return;
  }

  category.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'project-item';

    const thumb = document.createElement('div');
    thumb.className = 'project-thumb';
    if (item.image){
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title;
      img.onerror = () => { thumb.innerHTML = 'Gambar belum tersedia'; };
      // klik gambar -> buka lightbox (gambar penuh)
      thumb.addEventListener('click', () => {
        if (item.image) openLightbox(item.image, item.title);
      });
      thumb.appendChild(img);
    } else {
      thumb.textContent = 'Gambar belum tersedia';
    }

    const body = document.createElement('div');
    body.className = 'project-item-body';
    body.innerHTML = `
      <h4>${item.title}</h4>
      <p>${item.description || ''}</p>
    `;

    // Tombol "Lihat detail" -> membuka gambar asli (lightbox), bukan pindah halaman
    if (item.image){
      const detailBtn = document.createElement('button');
      detailBtn.type = 'button';
      detailBtn.className = 'project-detail-btn';
      detailBtn.textContent = 'Lihat detail →';
      detailBtn.addEventListener('click', () => openLightbox(item.image, item.title));
      body.appendChild(detailBtn);
    }

    // Kalau ada link project asli (mis. behance/drive), tampilkan sebagai link kecil terpisah
    if (item.link && item.link !== '#'){
      const externalLink = document.createElement('a');
      externalLink.href = item.link;
      externalLink.target = '_blank';
      externalLink.rel = 'noopener';
      externalLink.className = 'project-external-link';
      externalLink.textContent = 'Kunjungi project ↗';
      body.appendChild(externalLink);
    }

    card.appendChild(thumb);
    card.appendChild(body);
    modalGrid.appendChild(card);
  });
}

function openModal(categoryKey){
  renderProjects(categoryKey);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(){
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

categoryCards.forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.category));
});
modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* =====================================================
   LIGHTBOX — menampilkan gambar karya secara penuh
===================================================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(imageSrc, title){
  lightboxImg.src = imageSrc;
  lightboxImg.alt = title || '';
  lightboxCaption.textContent = title || '';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox(){
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
}

lightboxOverlay.addEventListener('click', closeLightbox);
lightboxClose.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* =====================================================
   FADE-IN SAAT SCROLL
===================================================== */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => observer.observe(el));

/* =====================================================
   TAHUN OTOMATIS DI FOOTER
===================================================== */
document.getElementById('year').textContent = new Date().getFullYear();
