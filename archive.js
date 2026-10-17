/* ═══════════════════════════════════════════
   PENSIVE RONIN — archive.js
   The Archive: an endless canvas of your work that drifts on its own,
   moves with the page as you scroll past it, and can be dragged in any
   direction. Click a frame to open it in the viewer.

   ── ADDING YOUR OWN WORK ──────────────────
   1. Put the file in assets/archive/:
        full/   full-size images (about 1400–2000px on the long edge)
        video/  short, muted .mp4 loops (a few seconds, under ~2 MB each)
        thumbs/ optional smaller copies (~640px wide) — the canvas loads
                these so it stays fast. If you skip a thumb, the full
                image is used instead.
   2. Add one line to ARCHIVE below. The order here is the order in the
      viewer; the canvas scatters them automatically and works out each
      frame's shape (portrait, square, wide) on its own.

      Image:  { src: 'assets/archive/full/name.jpg', thumb: 'assets/archive/thumbs/name.jpg', title: 'name', tag: 'photo edit' },
      Video:  { video: 'assets/archive/video/name.mp4', thumb: 'assets/archive/thumbs/name.jpg', title: 'name', tag: 'video edit' },

   The entries below are stand-ins made from your own animations.
   Swap them for your edits whenever you're ready.
   ═══════════════════════════════════════════ */

const ARCHIVE = [
  { src: 'assets/archive/full/tokyo-night-01.jpg',     thumb: 'assets/archive/thumbs/tokyo-night-01.jpg',     title: 'tokyo night 01',  tag: 'video still' },
  { src: 'assets/archive/full/cashforgold-01.jpg',     thumb: 'assets/archive/thumbs/cashforgold-01.jpg',     title: 'ca$hforgold',     tag: 'cover effect' },
  { src: 'assets/archive/full/cynthwave-01.jpg',       thumb: 'assets/archive/thumbs/cynthwave-01.jpg',       title: 'cynthwave 01',    tag: 'video still' },
  { video: 'assets/archive/video/dftwavy-loop.mp4',    thumb: 'assets/archive/thumbs/dftwavy-loop.jpg',       title: 'dftwavy',         tag: 'video loop' },
  { src: 'assets/archive/full/power-gradient-01.jpg',  thumb: 'assets/archive/thumbs/power-gradient-01.jpg',  title: 'power gradient 01', tag: 'colour study' },
  { src: 'assets/archive/full/baby-track-01.jpg',      thumb: 'assets/archive/thumbs/baby-track-01.jpg',      title: 'baby track 01',   tag: 'video still' },
  { src: 'assets/archive/full/tokyo-night-02.jpg',     thumb: 'assets/archive/thumbs/tokyo-night-02.jpg',     title: 'tokyo night 02',  tag: 'video still' },
  { video: 'assets/archive/video/cashforgold-led-loop.mp4', thumb: 'assets/archive/thumbs/cashforgold-led-loop.jpg', title: 'ca$hforgold led panel', tag: 'video loop' },
  { src: 'assets/archive/full/dftwavy-01.jpg',         thumb: 'assets/archive/thumbs/dftwavy-01.jpg',         title: 'dftwavy grid',    tag: 'video still' },
  { src: 'assets/archive/full/power-gradient-02.jpg',  thumb: 'assets/archive/thumbs/power-gradient-02.jpg',  title: 'power gradient 02', tag: 'colour study' },
  { src: 'assets/archive/full/cynthwave-02.jpg',       thumb: 'assets/archive/thumbs/cynthwave-02.jpg',       title: 'cynthwave 02',    tag: 'video still' },
  { src: 'assets/archive/full/cashforgold-03.jpg',     thumb: 'assets/archive/thumbs/cashforgold-03.jpg',     title: 'ca$hforgold trippy', tag: 'cover effect' },
  { src: 'assets/archive/full/baby-track-02.jpg',      thumb: 'assets/archive/thumbs/baby-track-02.jpg',      title: 'baby track 02',   tag: 'video still' },
  { src: 'assets/archive/full/power-gradient-03.jpg',  thumb: 'assets/archive/thumbs/power-gradient-03.jpg',  title: 'power gradient 03', tag: 'colour study' },
  { src: 'assets/archive/full/tokyo-night-03.jpg',     thumb: 'assets/archive/thumbs/tokyo-night-03.jpg',     title: 'tokyo night 03',  tag: 'video still' },
  { video: 'assets/archive/video/power-gradient-loop.mp4', thumb: 'assets/archive/thumbs/power-gradient-loop.jpg', title: 'power gradient loop', tag: 'video loop' },
  { src: 'assets/archive/full/cashforgold-02.jpg',     thumb: 'assets/archive/thumbs/cashforgold-02.jpg',     title: 'ca$hforgold led', tag: 'cover effect' },
  { src: 'assets/archive/full/cynthwave-03.jpg',       thumb: 'assets/archive/thumbs/cynthwave-03.jpg',       title: 'cynthwave 03',    tag: 'video still' },
  { src: 'assets/archive/full/dftwavy-02.jpg',         thumb: 'assets/archive/thumbs/dftwavy-02.jpg',         title: 'dftwavy stage',   tag: 'video still' },
  { src: 'assets/archive/full/baby-track-03.jpg',      thumb: 'assets/archive/thumbs/baby-track-03.jpg',      title: 'baby track 03',   tag: 'video still' },
  { src: 'assets/archive/full/power-gradient-04.jpg',  thumb: 'assets/archive/thumbs/power-gradient-04.jpg',  title: 'power gradient 04', tag: 'colour study' },
];

/* ═══════════════════════════════════════════
   Canvas engine — you shouldn't need to edit below this line.
   ═══════════════════════════════════════════ */
(() => {
  const root  = document.getElementById('archive');
  if (!root || !ARCHIVE.length) return;
  const plane = root.querySelector('.archive-plane');
  const hudCoord = document.getElementById('archiveCoord');
  const hudCount = document.getElementById('archiveCount');
  const curEl = document.getElementById('cur');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const items = ARCHIVE.map((d, i) => ({ ...d, i, thumb: d.thumb || d.src, ratio: 1 }));
  if (hudCount) hudCount.textContent = String(items.length).padStart(3, '0') + ' frames';

  // small deterministic "random" so the scatter is the same on every visit
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const mod = (a, n) => ((a % n) + n) % n;

  // canvas state
  let els = [], spanX = 1, spanY = 1, pad = 0, W = 0, H = 0;
  let offX = 0, offY = 0, vx = 0, vy = 0;
  let visible = false, booted = false, dragging = false, hovering = false, paused = false;
  const DRIFT = reduce ? { x: 0, y: 0 } : { x: -0.16, y: -0.30 };   // px per frame at rest

  /* ── layout ── */
  function measure() {
    return Promise.all(items.map(it => new Promise(res => {
      const im = new Image();
      im.onload = () => { it.ratio = (im.naturalWidth / im.naturalHeight) || 1; res(); };
      im.onerror = () => res();
      im.src = it.thumb;
    })));
  }

  function build() {
    W = root.clientWidth; H = root.clientHeight;
    const mobile = W < 700;
    const cols = mobile ? 3 : (W > 1100 ? 6 : 5);
    const cw = mobile ? Math.max(120, W / 2.7) : Math.min(300, Math.max(200, W / 5.4));
    const ch = cw * 1.18;
    const cells = cols * Math.ceil(items.length * 1.06 / cols);         // a few empty cells = breathing room
    const rows = cells / cols;
    const tileW = cols * cw, tileH = rows * ch;

    // deterministic shuffle of cells so neighbours change across the tile
    const order = [...Array(cells).keys()].sort((a, b) => hash(a + 41) - hash(b + 41));
    items.forEach((it, k) => {
      const cell = order[k], c = cell % cols, r = Math.floor(cell / cols);
      let w = cw * (0.62 + hash(k) * 0.28);
      let h = w / it.ratio;
      if (h > ch * 0.84) { h = ch * 0.84; w = h * it.ratio; }
      it.w = w; it.h = h;
      it.x = c * cw + (cw - w) * (0.12 + 0.76 * hash(k + 7));
      it.y = r * ch + (ch - h) * (0.12 + 0.76 * hash(k + 13));
    });

    pad = cw;
    const nx = Math.ceil((W + pad * 2) / tileW), ny = Math.ceil((H + pad * 2) / tileH);
    spanX = nx * tileW; spanY = ny * tileH;

    plane.textContent = '';
    els = [];
    for (let a = 0; a < nx; a++) for (let b = 0; b < ny; b++) {
      items.forEach(it => {
        const el = makeEl(it, a === 0 && b === 0);
        el._x = it.x + a * tileW; el._y = it.y + b * tileH; el._w = it.w; el._h = it.h;
        el.style.width = it.w + 'px'; el.style.height = it.h + 'px';
        plane.appendChild(el); els.push(el);
      });
    }
    render();
  }

  function makeEl(it, primary) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'arc-item' + (it.video ? ' is-video' : '');
    b.dataset.index = it.i;
    if (primary) b.setAttribute('aria-label', 'Open ' + it.title);
    else { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }

    if (it.video) {
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none';
      v.poster = it.thumb; v.src = it.video;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      b.appendChild(v); b._video = v;
      const badge = document.createElement('span');
      badge.className = 'arc-badge'; badge.textContent = 'loop';
      b.appendChild(badge);
    } else {
      const im = document.createElement('img');
      im.src = it.thumb; im.alt = ''; im.decoding = 'async'; im.draggable = false;
      b.appendChild(im);
    }
    const cap = document.createElement('span');
    cap.className = 'arc-cap';
    const num = document.createElement('b');
    num.textContent = String(it.i + 1).padStart(2, '0');
    cap.append(num, ' ' + it.title);
    b.appendChild(cap);

    // stagger the boot-in so frames arrive one by one
    b.style.setProperty('--d', (hash(it.i + 99) * 0.9).toFixed(2) + 's');
    return b;
  }

  /* ── render ── */
  function render() {
    for (const el of els) {
      const x = mod(el._x + offX + pad, spanX) - pad;
      const y = mod(el._y + offY + pad, spanY) - pad;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      if (el._video) {
        const on = visible && !paused && x > -el._w && x < W && y > -el._h && y < H;
        if (on && el._video.paused) el._video.play().catch(() => {});
        else if (!on && !el._video.paused) el._video.pause();
      }
    }
    if (hudCoord) {
      const fx = String(Math.abs(Math.round(-offX)) % 10000).padStart(4, '0');
      const fy = String(Math.abs(Math.round(-offY)) % 10000).padStart(4, '0');
      hudCoord.textContent = `x ${fx} / y ${fy}`;
    }
  }

  /* ── motion loop ── */
  function tick() {
    const moving = Math.abs(vx) + Math.abs(vy) > 0.02;
    if (!paused && (visible || moving)) {
      if (!dragging) {
        const slow = hovering ? 0.12 : 1;                 // hold still-ish while someone is looking
        vx += (DRIFT.x * slow - vx) * 0.035;
        vy += (DRIFT.y * slow - vy) * 0.035;
        offX += vx; offY += vy;
      }
      render();
    }
    requestAnimationFrame(tick);
  }

  /* ── page scroll moves the canvas while it's on screen ── */
  let lastScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    const d = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    if (visible && !reduce && !dragging) vy = Math.max(-28, Math.min(28, vy - d * 0.09));
  }, { passive: true });

  /* ── trackpad sideways swipe pans the canvas (vertical stays page scroll) ── */
  root.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); vx -= e.deltaX * 0.12; }
  }, { passive: false });

  /* ── drag / swipe ── */
  let px = 0, py = 0, moved = 0, freeY = true;
  root.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragging = true; moved = 0; px = e.clientX; py = e.clientY;
    freeY = e.pointerType === 'mouse' || e.pointerType === 'pen';   // touch: vertical swipes scroll the page
    vx = vy = 0;
    root.classList.add('is-dragging');
  });
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py;
    px = e.clientX; py = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    offX += dx; vx = dx;
    if (freeY) { offY += dy; vy = dy; }
  });
  const endDrag = () => { if (!dragging) return; dragging = false; root.classList.remove('is-dragging'); };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  root.addEventListener('click', e => {
    const b = e.target.closest('.arc-item');
    if (!b) return;
    if (moved > 8) { e.preventDefault(); return; }               // it was a drag, not a click
    openViewer(+b.dataset.index, b);
  });

  /* ── hover state + custom cursor label ── */
  const setCursor = label => {
    if (!curEl) return;
    if (label) { curEl.dataset.label = label; document.body.classList.add('cur-label'); }
    else { delete curEl.dataset.label; document.body.classList.remove('cur-label'); }
  };
  root.addEventListener('pointerover', e => {
    const onItem = !!e.target.closest('.arc-item');
    hovering = onItem;
    root.classList.toggle('is-hovering', onItem);
    setCursor(onItem ? 'open' : 'drag');
  });
  root.addEventListener('pointerleave', () => { hovering = false; root.classList.remove('is-hovering'); setCursor(''); });

  /* ── keyboard: bring the focused frame to the centre ── */
  root.addEventListener('focusin', e => {
    const b = e.target.closest('.arc-item');
    if (!b || !b.matches(':focus-visible')) return;
    const x = mod(b._x + offX + pad, spanX) - pad, y = mod(b._y + offY + pad, spanY) - pad;
    offX += W / 2 - (x + b._w / 2); offY += H / 2 - (y + b._h / 2);
    vx = vy = 0; render();
  });

  /* ── boot in when the section scrolls into view ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      visible = en.isIntersecting;
      if (visible && en.intersectionRatio > 0.2 && !booted) {
        booted = true;
        root.classList.add('is-booted');
        if (!reduce) { vy = -16; vx = -5; }                       // a rush of frames as you arrive
      }
    });
  }, { threshold: [0, 0.2] });

  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(build, 180); });

  measure().then(() => { build(); io.observe(root); requestAnimationFrame(tick); });

  /* ═══════════════════════════════════════════
     Viewer (lightbox)
     ═══════════════════════════════════════════ */
  const alb = document.getElementById('alb');
  const albMedia = document.getElementById('albMedia');
  const albCount = document.getElementById('albCount');
  const albTitle = document.getElementById('albTitle');
  const albTag = document.getElementById('albTag');
  const albStrip = document.getElementById('albStrip');
  let current = 0, returnTo = null, stripBuilt = false;

  function buildStrip() {
    items.forEach(it => {
      const t = document.createElement('button');
      t.type = 'button';
      t.setAttribute('aria-label', 'Show ' + it.title);
      const im = document.createElement('img');
      im.src = it.thumb; im.alt = ''; im.loading = 'lazy';
      t.appendChild(im);
      t.addEventListener('click', () => show(it.i));
      albStrip.appendChild(t);
    });
    stripBuilt = true;
  }

  function show(i) {
    current = mod(i, items.length);
    const it = items[current];
    alb.classList.add('is-switching');
    setTimeout(() => {
      albMedia.textContent = '';
      let m;
      if (it.video) {
        m = document.createElement('video');
        m.src = it.video; m.poster = it.thumb;
        m.muted = true; m.loop = true; m.autoplay = true; m.playsInline = true; m.controls = true;
        m.setAttribute('playsinline', '');
      } else {
        m = document.createElement('img');
        m.src = it.src || it.thumb; m.alt = it.title;
      }
      albMedia.appendChild(m);
      albCount.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
      albTitle.textContent = it.title;
      albTag.textContent = it.tag || '';
      [...albStrip.children].forEach((t, k) => t.classList.toggle('is-active', k === current));
      const act = albStrip.children[current];
      if (act) act.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
      const done = () => alb.classList.remove('is-switching');
      if (m.tagName === 'IMG' && !m.complete) { m.onload = done; m.onerror = done; } else requestAnimationFrame(done);
    }, reduce ? 0 : 160);
  }

  function openViewer(i, fromEl) {
    if (!stripBuilt) buildStrip();
    returnTo = fromEl || null;
    paused = true; render();
    alb.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => alb.classList.add('is-open'));
    show(i);
    alb.querySelector('.alb-close').focus({ preventScroll: true });
  }

  function closeViewer() {
    if (alb.hidden) return;
    alb.classList.remove('is-open');
    document.body.style.overflow = '';
    const v = albMedia.querySelector('video'); if (v) v.pause();
    setTimeout(() => { alb.hidden = true; albMedia.textContent = ''; }, reduce ? 0 : 280);
    paused = false;
    if (returnTo) returnTo.focus({ preventScroll: true });
  }

  alb.querySelector('.alb-close').addEventListener('click', closeViewer);
  alb.querySelector('.alb-prev').addEventListener('click', () => show(current - 1));
  alb.querySelector('.alb-next').addEventListener('click', () => show(current + 1));
  alb.addEventListener('click', e => { if (e.target === alb || e.target.classList.contains('alb-stage')) closeViewer(); });
  document.addEventListener('keydown', e => {
    if (alb.hidden) return;
    if (e.key === 'Escape') closeViewer();
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'ArrowLeft') show(current - 1);
  });

  // swipe between frames on touch screens
  let sx = null;
  alb.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') sx = e.clientX; });
  alb.addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
})();
