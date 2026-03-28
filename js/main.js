/* =====================================================
   THE WANDERING ROBOTICIST — main.js
   ===================================================== */

// ── Navbar: scroll state + active section highlighting ──
const navbar   = document.getElementById('navbar');
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

function onScroll() {
  // Scrolled state
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });


// ── Mobile nav toggle ──
const toggle   = document.querySelector('.nav-toggle');
const navList  = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
});

// Close on link click
navList?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navList?.classList.remove('open');
    toggle?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
});


// ── Scroll-triggered fade-in (staggered per group) ──
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    // If siblings in the same parent are also .fade-in, stagger them
    const siblings = Array.from(
      el.parentElement.querySelectorAll('.fade-in:not(.visible)')
    );
    const idx = siblings.indexOf(el);
    const delay = idx >= 0 ? idx * 90 : 0;

    setTimeout(() => el.classList.add('visible'), delay);
    observer.unobserve(el);
  });
}, {
  threshold:  0.12,
  rootMargin: '0px 0px -50px 0px',
});

fadeEls.forEach(el => observer.observe(el));


// ── Contact form ──
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const success = document.getElementById('form-success');
  if (!success) return;

  success.style.display = 'block';
  e.target.reset();

  setTimeout(() => { success.style.display = 'none'; }, 5000);
});


// ── Smooth-scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
