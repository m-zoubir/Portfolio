/* =========================================================
   Image fallback — called via inline onerror on each <img>.
   If the source image hasn't been added yet, remove the
   broken <img> and let the .media container show a dashed
   placeholder with the expected label (see CSS .is-empty).
========================================================= */
function mediaFallback(img){
  const wrap = img.closest('.media, .doc-preview');
  if (wrap){ wrap.classList.add('is-empty'); }
  img.remove();
}

document.addEventListener('DOMContentLoaded', () => {

  /* Year in footer */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav toggle (Side Drawer) */
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  const overlay = document.getElementById('nav-overlay');

  function closeNav() {
    if (nav) nav.classList.remove('open');
    if (toggle) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = ''; 
  }

  if (toggle && nav){
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      
      if (overlay) overlay.classList.toggle('open', isOpen);
      
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  /* Active nav link on scroll */
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = () => {
    let current = null;
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      link.classList.toggle('active', target === current);
    });
  };
  window.addEventListener('scroll', setActive, { passive:true });
  setActive();

  /* Scroll reveal */
  const revealTargets = document.querySelectorAll(
    '.skill-card, .tl-item, .project-card, .community-card, .cert-card, .edu-card, .lang-row, .stat'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });

  revealTargets.forEach(el => io.observe(el));

  /* =========================================================
     LIGHTBOX (Updated to include .doc-preview)
  ========================================================= */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  // Listen for clicks on both .media elements and .doc-preview elements
  document.querySelectorAll('.media, .doc-preview').forEach(el => {
    el.addEventListener('click', (e) => {
      // Prevent navigation if the element happened to be a link
      e.preventDefault(); 
      
      const img = el.querySelector('img');
      if (!img) return; // if it's an empty placeholder, do nothing
      
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });

  const closeLightbox = () => lightbox.classList.remove('open');
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox){
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

});

/* =========================================================
   LANGUAGE SWITCHER LOGIC
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const langBtnEn = document.getElementById('btn-en');
  const langBtnFr = document.getElementById('btn-fr');

  function setLanguage(lang) {
    document.body.setAttribute('data-lang', lang);
    
    if (lang === 'fr') {
      langBtnFr.classList.add('active');
      langBtnEn.classList.remove('active');
    } else {
      langBtnEn.classList.add('active');
      langBtnFr.classList.remove('active');
    }
    
    localStorage.setItem('maz_portfolio_lang', lang);
  }

  if (langBtnEn && langBtnFr) {
    langBtnEn.addEventListener('click', () => setLanguage('en'));
    langBtnFr.addEventListener('click', () => setLanguage('fr'));
    
    const savedLang = localStorage.getItem('maz_portfolio_lang') || 'en';
    setLanguage(savedLang);
  }
});