/* Siddhi Kale — portfolio behaviour
   1. page transitions   2. hero line streamed token by token   3. count-ups, scramble, reveals
   5. project map   6. copy buttons   7. ID card
   8. page chrome (menu, active section, project deck, clock)   9. laptop intro
   No framework, no dependencies. Everything degrades to plain HTML. */
(() => {
  'use strict';
  const d = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const EASE = 'cubic-bezier(0.7, 0, 0.2, 1)';
  const store = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
    del: (k) => { try { sessionStorage.removeItem(k); } catch { /* private mode */ } },
  };

  /* ---------- 1. page transitions ---------- */
  const veil = $('#veil');
  const slabs = veil ? $$('.veil-slab', veil) : [];
  const label = veil ? $('.veil-label', veil) : null;
  let leaving = false;

  function lit() {
    d.classList.add('is-lit');
    window.SKLit = lit;
    setTimeout(startHero, reduce ? 0 : 380);
    observe();
  }

  function uncover() {
    if (reduce || !veil || !d.classList.contains('is-veiled')) {
      d.classList.remove('is-veiled');
      lit();
      return;
    }
    const text = store.get('veil-label') || '';
    store.del('veil-label');
    label.textContent = text;
    label.style.opacity = text ? '1' : '0';
    const anims = slabs.map((s, i) =>
      s.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
        { duration: 760, delay: 160 + i * 42, easing: EASE, fill: 'forwards' }));
    label.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-36px)' }],
      { duration: 420, delay: 60, easing: 'ease-in', fill: 'forwards' });
    setTimeout(lit, 420);
    Promise.all(anims.map((a) => a.finished))
      .catch(() => {})
      .then(() => { d.classList.remove('is-veiled'); anims.forEach((a) => a.cancel()); });
  }

  function cover(url, text) {
    if (leaving || !veil) { location.href = url; return; }
    leaving = true;
    veil.style.visibility = 'visible';
    label.textContent = text;
    label.style.opacity = '0';
    slabs.forEach((s, i) =>
      s.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
        { duration: 560, delay: i * 40, easing: EASE, fill: 'forwards' }));
    label.animate([{ opacity: 0, transform: 'translateY(36px)' }, { opacity: 1, transform: 'none' }],
      { duration: 460, delay: 340, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' });
    store.set('veil-label', text);
    setTimeout(() => { location.href = url; }, 560 + slabs.length * 40 + 110);
  }

  // clicking a project card throws it into the distance; the project opens from where it lands
  function shoot(a, e) {
    const card = a.closest('.hcard-in');
    if (!card || leaving) return;
    e.preventDefault();
    leaving = true;
    const r = card.getBoundingClientRect();
    const ghost = card.cloneNode(true);
    ghost.classList.add('ghost-card');
    Object.assign(ghost.style, {
      position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px',
      margin: '0', zIndex: '500', pointerEvents: 'none', transformOrigin: '50% 50%',
    });
    document.body.appendChild(ghost);
    card.style.visibility = 'hidden';
    const dim = document.createElement('div');
    dim.className = 'shoot-dim';
    document.body.appendChild(dim);
    dim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, fill: 'forwards' });
    const tx = innerWidth * 0.5, ty = innerHeight * 0.38;
    const dx = tx - (r.left + r.width / 2), dy = ty - (r.top + r.height / 2);
    store.set('shoot', '1');
    let went = false;
    const go = () => { if (!went) { went = true; location.href = a.href; } };
    const anim = ghost.animate([
      { transform: 'perspective(900px) translate3d(0, 0, 0) rotateZ(0deg) rotateY(0deg) scale(1)', opacity: 1, offset: 0 },
      { transform: `perspective(900px) translate3d(${dx * 0.1}px, ${dy * 0.1 - 36}px, 70px) rotateZ(-8deg) rotateY(-12deg) scale(1.05)`, opacity: 1, offset: 0.18 },
      { transform: `perspective(900px) translate3d(${dx}px, ${dy}px, -1600px) rotateZ(1080deg) rotateY(540deg) scale(0.25)`, opacity: 1, offset: 0.92 },
      { transform: `perspective(900px) translate3d(${dx}px, ${dy}px, -1800px) rotateZ(1180deg) rotateY(600deg) scale(0.1)`, opacity: 0, offset: 1 },
    ], { duration: 950, easing: 'cubic-bezier(0.55, 0, 0.8, 0.45)', fill: 'forwards' });
    setTimeout(() => {
      const ring = document.createElement('div');
      ring.className = 'shoot-ring';
      ring.style.left = tx + 'px';
      ring.style.top = ty + 'px';
      document.body.appendChild(ring);
      ring.animate([{ transform: 'translate(-50%, -50%) scale(0.2)', opacity: 1 }, { transform: 'translate(-50%, -50%) scale(26)', opacity: 0 }],
        { duration: 540, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' });
    }, 760);
    anim.finished.then(go, go);
    setTimeout(go, 1500); // never get stuck behind an animation
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[data-shoot]');
    // touch: the first tap turns the card over, the second opens it
    if (a && !canHover) {
      const card = a.closest('.hcard');
      if (card && !card.classList.contains('is-flipped')) {
        e.preventDefault();
        document.querySelectorAll('.hcard.is-flipped').forEach((x) => x.classList.remove('is-flipped'));
        card.classList.add('is-flipped');
        return;
      }
    }
    if (!a || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    shoot(a, e);
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    if (u.pathname === location.pathname && u.search === location.search) return; // same page: let the browser scroll
    if (/\.\w+$/.test(u.pathname) && !/\.html$/.test(u.pathname)) return;
    if (reduce) return;
    e.preventDefault();
    cover(u.href, a.dataset.label || a.textContent.trim().replace(/\s+/g, ' ').slice(0, 28));
  });

  // Warm the next page on intent.
  const warmed = new Set();
  const warm = (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.origin !== location.origin || warmed.has(a.href) || a.target === '_blank') return;
    warmed.add(a.href);
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.href = a.href; document.head.appendChild(l);
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);

  window.addEventListener('pageshow', (e) => {
    if (!e.persisted || !veil) return;
    leaving = false;
    slabs.forEach((s) => s.getAnimations().forEach((a) => a.cancel()));
    label.getAnimations().forEach((a) => a.cancel());
    veil.style.visibility = '';
    d.classList.remove('is-veiled');
  });

  /* ---------- 2. hero lines, streamed one token at a time ---------- */
  function tokenise(text) {
    // Rough BPE feel: long words arrive in two pieces.
    const out = [];
    (text.match(/\S+\s*/g) || [text]).forEach((w) => {
      const m = w.match(/^(\S+)(\s*)$/);
      const word = m ? m[1] : w, tail = m ? m[2] : '';
      if (word.length > 6) {
        const cut = Math.ceil(word.length * 0.55);
        out.push(word.slice(0, cut), word.slice(cut) + tail);
      } else out.push(word + tail);
    });
    return out;
  }

  let heroTimer = 0;
  function startHero() {
    const el = $('.hero-quote');
    if (!el) return;
    const out = $('.hq-text', el);
    const src = el.dataset.quote || '';
    if (!src || reduce) return; // the static markup already holds the finished line
    const escHtml = (t) => t.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    // words arrive one piece at a time; *marked* words stay whole and get the highlight
    const toks = [];
    (src.match(/\*[^*]+\*|\S+\s*/g) || [src]).forEach((w) => {
      if (w[0] === '*') { toks.push('<mark class="hl">' + escHtml(w.slice(1, -1)) + '</mark>'); return; }
      const m = w.match(/^(\S+)(\s*)$/);
      const word = m ? m[1] : w, tail = m ? m[2] : '';
      if (word.length > 6) {
        const cut = Math.ceil(word.length * 0.55);
        toks.push(escHtml(word.slice(0, cut)), escHtml(word.slice(cut) + tail));
      } else toks.push(escHtml(word + tail));
    });
    out.innerHTML = '';
    let acc = '', k = 0;
    (function step() {
      acc += toks[k++];
      out.innerHTML = acc;
      if (window.SKCinema && window.SKCinema.ticking) window.SKCinema.sfx.blip(1500 + (k % 4) * 170, 0.03);
      if (k < toks.length) heroTimer = setTimeout(step, 70 + Math.random() * 130);
    })();
  }

  /* ---------- 3. count-ups, scramble, reveals, active section ---------- */
  const CH = 'abcdefghijklmnopqrstuvwxyz0123456789<>/[]{}#*+=';
  function scramble(el) {
    const final = el.dataset.scramble;
    let f = 0;
    const frames = 24;
    (function tick() {
      f++;
      const p = f / frames;
      el.textContent = [...final].map((c, i) => (c === ' ' || i < p * final.length ? c : CH[(Math.random() * CH.length) | 0])).join('');
      if (f < frames) setTimeout(tick, 32); else el.textContent = final;
    })();
  }

  function observe() {
    const counters = $$('[data-count]');
    const evals = $$('.evals');
    const scr = $$('[data-scramble]');
    const reveal = $$('.rec, .svc-card, .frame, .path-list li, .about-copy, .badge, .tcard, .tcore, .tile, .ctile, .cpanel-main, .role-card');
    const fmt = (v, dec) => v.toFixed(dec);

    if (!('IntersectionObserver' in window) || reduce) {
      evals.forEach((n) => n.classList.add('is-in'));
      return;
    }
    reveal.forEach((n) => n.classList.add('resolve'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        if (el.dataset.scramble) { scramble(el); return; }
        if (el.classList.contains('resolve')) { el.classList.add('is-in'); return; }
        if (el.classList.contains('evals')) { el.classList.add('is-in'); return; }
        const end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
        const tile = el.closest('.tile');
        const target = tile && tile.dataset.fill ? parseFloat(tile.dataset.fill) : null;
        const t0 = performance.now(), dur = 1500;
        (function tick(t) {
          const p = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 4);
          el.textContent = fmt(end * e, dec);
          if (target != null) tile.style.setProperty('--fill', (target * e).toFixed(4));
          if (p < 1) requestAnimationFrame(tick);
          else { el.textContent = fmt(end, dec); if (target != null) tile.style.setProperty('--fill', String(target)); }
        })(t0);
      });
    }, { threshold: 0.1 });

    counters.forEach((c) => {
      c.textContent = fmt(0, parseInt(c.dataset.dec || '0', 10));
      const t = c.closest('.tile');
      if (t && t.dataset.fill) t.style.setProperty('--fill', '0');
      io.observe(c);
    });
    [...evals, ...scr, ...reveal].forEach((n) => io.observe(n));
  }

  /* ---------- 5. project map ---------- */
  const mapEl = $('.map');
  if (mapEl) {
    const field = $('.map-field', mapEl), svg = $('.map-links', field), hint = $('.map-hint', mapEl);
    const nodes = $$('.node', field);
    const home = hint.textContent;
    const nice = { gemini: 'Gemini', multilingual: 'more than one language', agents: 'agent design', live: 'a live demo',
      langgraph: 'LangGraph', vision: 'computer vision', dashboard: 'dashboards', winner: 'a win', healthcare: 'healthcare', gis: 'GIS', paper: 'the paper' };
    const pos = (n) => [parseFloat(n.style.getPropertyValue('--x')), parseFloat(n.style.getPropertyValue('--y'))];
    const tagsOf = (n) => (n.dataset.tags || '').split(' ').filter(Boolean);
    const clear = () => {
      svg.innerHTML = '';
      nodes.forEach((n) => n.classList.remove('is-on', 'is-focus'));
      mapEl.classList.remove('has-focus');
      hint.textContent = home;
    };
    const show = (n) => {
      clear();
      const mine = tagsOf(n), [x1, y1] = pos(n), names = [], shared = new Set();
      nodes.forEach((o) => {
        if (o === n) return;
        const common = tagsOf(o).filter((t) => mine.includes(t));
        if (!common.length) return;
        const [x2, y2] = pos(o);
        const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ln.setAttribute('x1', x1); ln.setAttribute('y1', y1); ln.setAttribute('x2', x2); ln.setAttribute('y2', y2);
        svg.appendChild(ln);
        o.classList.add('is-on');
        names.push($('.node-name', o).textContent);
        common.forEach((t) => shared.add(nice[t] || t));
      });
      n.classList.add('is-focus');
      mapEl.classList.add('has-focus');
      const nm = $('.node-name', n).textContent;
      hint.textContent = names.length
        ? `${nm} shares ${[...shared].join(' and ')} with ${names.join(', ')}.`
        : `${nm} stands on its own in this set.`;
    };
    nodes.forEach((n) => {
      n.addEventListener('pointerenter', () => show(n));
      n.addEventListener('focus', () => show(n));
      n.addEventListener('pointerleave', clear);
      n.addEventListener('blur', clear);
    });
  }

  /* ---------- 6. copy buttons ---------- */
  $$('.copy').forEach((b) => b.addEventListener('click', async () => {
    const v = b.dataset.copy, t = $('.copy-t', b), status = $('.copy-status');
    try { await navigator.clipboard.writeText(v); }
    catch {
      const ta = document.createElement('textarea'); ta.value = v; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    b.classList.add('is-done'); if (t) t.textContent = 'Copied';
    if (status) status.textContent = `${v} copied to clipboard`;
    setTimeout(() => { b.classList.remove('is-done'); if (t) t.textContent = 'Copy'; }, 1800);
  }));

  /* ---------- 7. ID card ---------- */
  $$('[data-idcard]').forEach((card) => {
    const front = $('.face-front', card), back = $('.face-back', card);
    const set = (flipped) => {
      card.classList.toggle('is-flipped', flipped);
      front.setAttribute('aria-hidden', String(flipped));
      back.setAttribute('aria-hidden', String(!flipped));
    };
    card.addEventListener('click', () => set(!card.classList.contains('is-flipped')));
    // it arrives showing its back, then turns itself over to the front once it is in view
    if (!reduce && 'IntersectionObserver' in window) {
      set(true);
      const fio = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        fio.disconnect();
        setTimeout(() => {
          set(false);
          if (window.SKCinema && window.SKCinema.sfx) window.SKCinema.sfx.soft();
        }, 700);
      }, { threshold: 0.55 });
      fio.observe(card);
    }
    if (reduce || !canHover) return;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.classList.add('is-tilting');
      card.style.setProperty('--ry', ((x - 0.5) * 22).toFixed(1) + 'deg');
      card.style.setProperty('--rx', ((0.5 - y) * 16).toFixed(1) + 'deg');
      card.style.setProperty('--gx', (x * 100).toFixed(0) + '%');
      card.style.setProperty('--gy', (y * 100).toFixed(0) + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg');
    });
  });

  /* ---------- 8. page chrome ---------- */
  const bar = $('.bar');
  const menuBtn = $('.bar-menu');
  if (bar && menuBtn) {
    const setOpen = (o) => {
      bar.classList.toggle('is-open', o);
      menuBtn.setAttribute('aria-expanded', String(o));
      $('.bar-menu-t', menuBtn).textContent = o ? 'Close' : 'Menu';
    };
    menuBtn.addEventListener('click', () => setOpen(!bar.classList.contains('is-open')));
    $$('.bar-nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // which section is on screen lights the matching nav link
  const homeSecs = $$('main.home > section[id]');
  if (homeSecs.length && 'IntersectionObserver' in window) {
    const links = $$('.bar-nav .link[data-section]');
    const so = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('is-active', l.dataset.section === en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    homeSecs.forEach((s) => so.observe(s));
  }

  // the project rail: cards side by side, arrows scroll for more
  const railWrap = $('[data-rail]');
  if (railWrap) {
    const rail = $('.rail', railWrap), prev = $('[data-rail-prev]', railWrap), next = $('[data-rail-next]', railWrap);
    const thumb = $('.rail-track i', railWrap), now = $('[data-rail-now]', railWrap);
    const cards = $$('.hcard', rail);
    const gap = () => parseFloat(getComputedStyle(rail).columnGap) || 24;
    const step = () => (cards[0] ? cards[0].getBoundingClientRect().width + gap() : 380);
    const update = () => {
      const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      prev.disabled = rail.scrollLeft <= 4;
      next.disabled = rail.scrollLeft >= max - 4;
      const ratio = Math.min(1, rail.clientWidth / rail.scrollWidth);
      thumb.style.width = (ratio * 100).toFixed(1) + '%';
      thumb.style.transform = `translateX(${(max > 0 ? (rail.scrollLeft / max) * (100 / ratio - 100) : 0).toFixed(1)}%)`;
      if (now) now.textContent = String(Math.min(cards.length, Math.round(rail.scrollLeft / step()) + 1));
    };
    const by = (dir) => rail.scrollBy({ left: dir * step() * (window.innerWidth > 900 ? 2 : 1), behavior: reduce ? 'auto' : 'smooth' });
    prev.addEventListener('click', () => by(-1));
    next.addEventListener('click', () => by(1));
    rail.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    // drag with a mouse
    let down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6) { rail.classList.add('is-drag'); rail.scrollLeft = sl - dx; }
    });
    window.addEventListener('pointerup', () => { down = false; setTimeout(() => rail.classList.remove('is-drag'), 0); });
    rail.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
    update();
  }

  // local time, as a quiet proof that someone is actually there
  const clocks = $$('[data-clock]');
  if (clocks.length) {
    const tick = () => {
      clocks.forEach((c) => {
        try {
          c.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: c.dataset.clock });
        } catch { c.textContent = ''; }
      });
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- 9. opening: walk into a laptop ---------- */
  const fontsReady = Promise.race([
    document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, 1500)),
  ]);

  function runPortal(still) {
    const el = $('#portal');
    const lp = $('.lp', el), flash = $('.lp-flash', el), msg = $('.portal-msg', el), skip = $('.portal-skip', el);
    const bar = $('.scr-bar i', el), pctEl = $('.scr-pct', el), logs = $$('.scr-log li', el);
    const DUR = 5.0;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
    const inOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const easeIn = (x) => x * x * x;
    const gate = $('.portal-gate', el);
    const cin = window.SKCinema;
    let started = still != null, fxRise = false, fxHit = false;
    let ready = false, done = false, t = 0, last = performance.now();
    fontsReady.then(() => { ready = true; });
    setTimeout(() => { ready = true; }, 2600);

    function render(tt) {
      const W = lp.offsetWidth || 700, H = W * 0.625;
      const open = inOut(seg(tt, 0.5, 1.7));
      const zp = seg(tt, 3.1, 4.7);
      // end scale: the screen should cover the viewport
      const fill = Math.max((innerWidth * 1.08) / W, (innerHeight * 1.08) / H);
      const zoom = 0.7 + (fill - 0.7) * easeIn(zp);
      const cam = 60 - 6 * seg(tt, 0, 3) - 54 * inOut(zp);
      // closed, the lid lies over the deck and sits low: lift it, then settle as it opens
      const ty = -H * (0.16 + 0.34 * (1 - open)) * (1 - inOut(zp));
      lp.style.setProperty('--lid', (-90 + 98 * open).toFixed(2) + 'deg');
      lp.style.setProperty('--cam', (-cam).toFixed(2) + 'deg'); // negative: the camera looks down from above
      lp.style.setProperty('--zoom', zoom.toFixed(4));
      lp.style.setProperty('--ty', ty.toFixed(1) + 'px');
      lp.style.setProperty('--glow-a', (0.4 * open).toFixed(2));
      lp.style.setProperty('--key-a', (0.3 * open).toFixed(2));
      const boot = seg(tt, 1.7, 3.5);
      lp.style.setProperty('--p', boot.toFixed(3));
      pctEl.textContent = Math.round(boot * 100) + '%';
      const shown = Math.floor(boot * (logs.length + 0.4));
      logs.forEach((l, i) => l.classList.toggle('on', i < shown));
      el.style.setProperty('--flash', seg(tt, 4.35, 4.95).toFixed(3));
      flash.style.setProperty('--flash', seg(tt, 4.35, 4.95).toFixed(3));
      msg.textContent = tt < 0.5 ? 'Powering on' : tt < 1.7 ? 'Opening up' : tt < 3.1 ? 'Booting' : 'Going in';
    }

    function finish() {
      if (done) return;
      done = true;
      try { sessionStorage.setItem('portal-seen', '1'); } catch { /* private mode */ }
      if (cin && cin.eligible() && still == null && started) {
        // the avatar sequence takes over beneath the fading laptop
        cin.play();
        d.classList.add('is-cinema');
        el.classList.add('is-out');
        setTimeout(() => { d.classList.remove('is-portal'); el.remove(); }, 800);
        return;
      }
      d.classList.add('is-arriving');
      el.classList.add('is-out');
      setTimeout(() => {
        d.classList.remove('is-portal');
        el.remove();
        lit();
      }, 700);
      setTimeout(() => d.classList.remove('is-arriving'), 1700);
    }

    function frame(now) {
      if (done) return;
      if (!started) { last = now; requestAnimationFrame(frame); return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      t = Math.min(ready ? DUR : 3.05, t + dt * 1.7); // the laptop runs about 1.7x: the avatar is the main act
      if (cin && !fxRise && t > 3.0) { fxRise = true; cin.sfx.riser(1.8); }
      if (cin && !fxHit && t > 4.4) { fxHit = true; cin.phase('laptop'); }
      render(t);
      if (t >= DUR) finish(); else requestAnimationFrame(frame);
    }

    if (still != null) {
      // Test hook: ?intro-frame=0.5 paints one moment of the intro (0 to 1) and stops.
      ready = true;
      render(still * DUR);
      return;
    }
    skip.addEventListener('click', finish);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') finish(); });
    const begin = (withSound) => {
      if (started) return;
      started = true;
      if (gate) gate.classList.add('is-gone');
      if (cin) cin.arm(withSound);
      last = performance.now();
      setTimeout(finish, 20000); // never trap anyone behind an animation
    };
    begin(true);
    render(0);
    requestAnimationFrame((n) => { last = n; frame(n); });
  }

  function iris() {
    d.classList.remove('is-veiled', 'is-portal');
    const x = innerWidth * 0.5, y = innerHeight * 0.38;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 40;
    const a = d.animate(
      [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)` }],
      { duration: 950, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'both' });
    d.classList.remove('is-shot');
    setTimeout(lit, 280);
    const done = () => { try { a.cancel(); } catch { /* already gone */ } };
    a.finished.then(done, done);
    setTimeout(done, 1700); // never leave the page clipped
  }

  // a thin amber line that fills as you read
  const prog = document.createElement('div');
  prog.className = 'progress';
  prog.setAttribute('aria-hidden', 'true');
  document.body.appendChild(prog);
  const setProg = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0})`;
  };
  window.addEventListener('scroll', setProg, { passive: true });
  window.addEventListener('resize', setProg);
  setProg();

  /* ---------- boot ---------- */
  const boot = () => {
    if (d.classList.contains('is-shot')) { store.del('shoot'); if (reduce) { d.classList.remove('is-shot'); lit(); } else iris(); return; }
    const m = location.search.match(/intro-frame=([\d.]+)/);
    if (m) { d.classList.remove('is-veiled'); d.classList.add('is-portal'); runPortal(parseFloat(m[1])); return; }
    if (d.classList.contains('is-portal')) {
      if (document.hidden && !/force-intro/.test(location.search)) { d.classList.remove('is-portal'); lit(); } else runPortal();
    } else fontsReady.then(() => setTimeout(uncover, 0));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
