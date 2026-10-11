/* ═══════════════════════════════════════════
   PENSIVE RONIN — script.js
   ═══════════════════════════════════════════ */

/* ── chrome split cursor (white dot + silver & steel ghosts) ── */
const cur  = document.getElementById('cur');
const curR = document.getElementById('curR');
const curB = document.getElementById('curB');

let mx = 0, my = 0;
let rx = 0, ry = 0;
let bx = 0, by = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

function animCur() {
  // silver ghost lags slightly
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  // steel ghost lags more
  bx += (mx - bx) * 0.07;
  by += (my - by) * 0.07;

  curR.style.left = rx + 'px';
  curR.style.top  = ry + 'px';
  curB.style.left = bx + 'px';
  curB.style.top  = by + 'px';

  requestAnimationFrame(animCur);
}
animCur();

/* ── Scroll progress bar ── */
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('prog').style.width = pct + '%';
});

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      setTimeout(() => el.classList.add('visible'), el.dataset.delay || 0);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-l').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  revealObs.observe(el);
});

/* ── Mobile nav hamburger ── */
document.getElementById('ham').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* ── Lightbox ── */
function openLb(el) {
  document.getElementById('lbTitle').textContent = el.dataset.name;
  document.getElementById('lbTag').textContent   = el.dataset.tag;
  document.getElementById('lbType').textContent  =
    el.dataset.type === 'video' ? '// drop video here' : '// drop photo here';
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLb() {
  document.getElementById('lb').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLbOut(e) {
  if (e.target.id === 'lb') closeLb();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLb();
});

/* ── Hero background text parallax ── */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  const bg = document.querySelector('.hero-bg');
  if (bg) {
    bg.style.transform = `translateY(calc(-50% + ${y * 0.4}px)) translateX(${x * 0.4}px)`;
  }
});
