/* =========================================================
   Image fallback — called via inline onerror on each <img>.
   If the source image hasn't been added yet, remove the
   broken <img> and let the .media container show a dashed
   placeholder with the expected label (see CSS .is-empty).
========================================================= */
function mediaFallback(img){
  const wrap = img.closest('.media');
  if (wrap){ wrap.classList.add('is-empty'); }
  img.remove();
}

document.addEventListener('DOMContentLoaded', () => {

  /* Year in footer */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav toggle */
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav){
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
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

  /* Lightbox for media images that loaded successfully */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.media').forEach(mediaEl => {
    mediaEl.addEventListener('click', () => {
      const img = mediaEl.querySelector('img');
      if (!img) return; // placeholder, nothing to enlarge
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
