/* Siddhi Kale: motion and sound across the site.
   Cursor light, magnetic buttons, card tilt, section reveals, the timeline, and quiet interface sounds.
   Sounds come from the synthesiser in cinema.js and follow the speaker toggle. */
(() => {
  'use strict';
  const d = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const play = (name, ...a) => {
    const s = window.SKCinema && window.SKCinema.sfx;
    if (s && typeof s[name] === 'function') s[name](...a);
  };
  const quiet = () => d.classList.contains('is-cinema') || d.classList.contains('is-portal');

  /* ---------- a soft light that follows the cursor ---------- */
  if (fine && !reduce) {
    const sp = document.createElement('div');
    sp.className = 'fx-spot';
    sp.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sp);
    let x = innerWidth / 2, y = innerHeight / 3, tx = x, ty = y, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      sp.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; sp.classList.add('on'); if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
  }

  /* ---------- a ring that trails the cursor and grows over things you can press ---------- */
  if (fine && !reduce) {
    const ring = document.createElement('div');
    ring.className = 'fx-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
    let rx = -100, ry = -100, gx = -100, gy = -100, rr = 0;
    const spin = () => {
      rx += (gx - rx) * 0.22; ry += (gy - ry) * 0.22;
      ring.style.transform = 'translate(' + rx.toFixed(1) + 'px, ' + ry.toFixed(1) + 'px)';
      rr = Math.abs(gx - rx) + Math.abs(gy - ry) > 0.3 ? requestAnimationFrame(spin) : 0;
    };
    addEventListener('pointermove', (e) => {
      gx = e.clientX; gy = e.clientY;
      ring.classList.add('on');
      ring.classList.toggle('is-hot', !!(e.target.closest && e.target.closest('a, button, .hcard, .cta, .ghost')));
      if (!rr) rr = requestAnimationFrame(spin);
    }, { passive: true });
    document.addEventListener('pointerdown', () => ring.classList.add('is-down'), true);
    document.addEventListener('pointerup', () => ring.classList.remove('is-down'), true);
    document.documentElement.addEventListener('pointerleave', () => ring.classList.remove('on'));
  }

  /* ---------- interface sounds ---------- */
  const HOVER = 'a.link, .mark, .cta, .ghost, .btn, .icon-btn, .bar-resume, .hcard, .svc-card-link, .rail-btn, .flip, .frame, .ctile, .snd';
  let lastEl = null, lastAt = 0;
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch' || quiet()) return;
    const t = e.target.closest && e.target.closest(HOVER);
    if (!t || t === lastEl) return;
    lastEl = t;
    const n = performance.now();
    if (n - lastAt < 70) return;
    lastAt = n;
    play(t.classList.contains('hcard') ? 'soft' : 'tick');
  }, true);
  document.addEventListener('pointerout', (e) => { if (e.target === lastEl || (lastEl && lastEl.contains(e.target))) lastEl = null; }, true);
  document.addEventListener('click', (e) => {
    if (quiet()) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (a && a.origin === location.origin && a.target !== '_blank') { play('whoosh', 0.7); return; }
    if (e.target.closest && e.target.closest('button, .cta, .ghost, .btn, .flip')) play('pop');
  }, true);

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduce) {
    $$('.cta, .ghost, .btn, .bar-resume, .icon-btn').forEach((el) => {
      let on = false;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.translate = `${(dx * 8).toFixed(1)}px ${(dy * 6).toFixed(1)}px`;
        on = true;
      });
      el.addEventListener('pointerleave', () => { if (on) { el.style.translate = ''; on = false; } });
    });
  }

  /* ---------- tilt on boxes ---------- */
  if (fine && !reduce) {
    $$('.cbox, .flow-boxes li, .svc-card-link, .tl-body').forEach((el) => {
      el.classList.add('fx-tilt');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', (px * 7).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-py * 6).toFixed(2) + 'deg');
        el.style.setProperty('--gx', ((px + 0.5) * 100).toFixed(0) + '%');
        el.style.setProperty('--gy', ((py + 0.5) * 100).toFixed(0) + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
    });
  }

  /* ---------- sections draw their rule, stats chime ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        en.target.classList.add('fx-seen');
        if (!quiet() && en.target.classList.contains('sec')) play('soft');
      });
    }, { threshold: 0.18 });
    $$('.sec, .numbers, .exp, .marquee').forEach((n) => io.observe(n));
  } else {
    $$('.sec, .numbers, .exp, .marquee').forEach((n) => n.classList.add('fx-seen'));
  }

  /* ---------- the experience timeline ---------- */
  const items = $$('.tl-item');
  if (items.length) {
    if ('IntersectionObserver' in window && !reduce) {
      let n = 0;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          const delay = (n++ % 4) * 140;
          setTimeout(() => {
            en.target.classList.add('in');
            if (!quiet()) play('pop');
          }, delay);
        });
      }, { threshold: 0.55 });
      items.forEach((i) => io.observe(i));
    } else items.forEach((i) => i.classList.add('in'));
  }

  /* ---------- a shockwave and a few sparks wherever you press ---------- */
  if (!reduce) {
    document.addEventListener('pointerdown', (e) => {
      if (e.target.closest && e.target.closest('input, textarea, select')) return;
      const w = document.createElement('span');
      w.className = 'fx-wave';
      w.style.left = e.clientX + 'px';
      w.style.top = e.clientY + 'px';
      for (let i = 0; i < 7; i++) {
        const s = document.createElement('i');
        const a = (i / 7) * 6.283 + Math.random() * 0.6, r = 26 + Math.random() * 38;
        s.style.setProperty('--dx', (Math.cos(a) * r).toFixed(1) + 'px');
        s.style.setProperty('--dy', (Math.sin(a) * r).toFixed(1) + 'px');
        w.appendChild(s);
      }
      document.body.appendChild(w);
      setTimeout(() => w.remove(), 900);
    }, true);
  }

  /* ---------- a thin trail of embers behind the cursor ---------- */
  if (fine && !reduce) {
    let last = 0;
    addEventListener('pointermove', (e) => {
      const n = performance.now();
      if (n - last < 55 || quiet()) return;
      last = n;
      const p = document.createElement('i');
      p.className = 'fx-ember';
      p.style.left = e.clientX + (Math.random() * 10 - 5) + 'px';
      p.style.top = e.clientY + (Math.random() * 10 - 5) + 'px';
      p.style.setProperty('--ex', (Math.random() * 30 - 15).toFixed(0) + 'px');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }, { passive: true });
  }

  /* ---------- the name answers a click; the portrait follows the cursor ---------- */
  const heroName = $('.hero .name');
  if (heroName && !reduce) {
    heroName.classList.add('is-poke');
    heroName.addEventListener('click', () => {
      heroName.classList.remove('is-glitch');
      void heroName.offsetWidth;
      heroName.classList.add('is-glitch');
      play('glitch');
      setTimeout(() => heroName.classList.remove('is-glitch'), 520);
    });
  }
  const heroEl = $('.hero'), frame = $('.photo-frame');
  if (heroEl && frame && fine && !reduce) {
    heroEl.addEventListener('pointermove', (e) => {
      const r = heroEl.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      frame.style.setProperty('--hx', (px * 10).toFixed(2) + 'deg');
      frame.style.setProperty('--hy', (-py * 8).toFixed(2) + 'deg');
    });
    heroEl.addEventListener('pointerleave', () => { frame.style.setProperty('--hx', '0deg'); frame.style.setProperty('--hy', '0deg'); });
  }

  /* ---------- the hero quote: every word reacts ---------- */
  const quote = $('.hq-text');
  if (quote && !reduce) {
    const wrapWords = () => {
      if (quote.dataset.words || !quote.textContent.trim()) return;
      const want = (quote.closest('.hero-quote').dataset.quote || '').replace(/\*/g, '').trim();
      if (quote.textContent.trim() !== want) return; // still streaming
      quote.dataset.words = '1';
      const walk = (node) => {
        Array.from(node.childNodes).forEach((c) => {
          if (c.nodeType === 3) {
            const frag = document.createDocumentFragment();
            c.textContent.split(/(\s+)/).forEach((w) => {
              if (!w) return;
              if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
              const s = document.createElement('span');
              s.className = 'qw';
              s.textContent = w;
              frag.appendChild(s);
            });
            c.replaceWith(frag);
          } else if (c.nodeType === 1) walk(c);
        });
      };
      walk(quote);
    };
    const qt = setInterval(() => { wrapWords(); if (quote.dataset.words) clearInterval(qt); }, 400);
    quote.addEventListener('pointerover', (e) => {
      const w = e.target.closest && e.target.closest('.qw');
      if (w) play('tick');
    });
    quote.addEventListener('click', (e) => {
      const w = e.target.closest && e.target.closest('.qw');
      if (!w) return;
      w.classList.remove('is-hop');
      void w.offsetWidth;
      w.classList.add('is-hop');
      play('pop');
    });
  }

  /* ---------- section titles decode as they arrive ---------- */
  const decode = (el) => {
    const final = el.textContent;
    if (!final || el.children.length || el.dataset.decoded) return;
    el.dataset.decoded = '1';
    el.setAttribute('aria-label', final);
    const set = 'abcdefghijklmnopqrstuvwxyz0123456789<>/{}#';
    let k = 0;
    const id = setInterval(() => {
      k += 1;
      const reveal = Math.floor((k / 16) * final.length);
      el.textContent = final.split('').map((c, i) => (i < reveal || c === ' ' || /[.,:;'’]/.test(c) ? c : set[Math.floor(Math.random() * set.length)])).join('');
      if (k >= 16) { clearInterval(id); el.textContent = final; el.removeAttribute('aria-label'); }
    }, 42);
  };
  if ('IntersectionObserver' in window && !reduce) {
    const dio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        dio.unobserve(en.target);
        decode(en.target);
      });
    }, { threshold: 0.6 });
    $$('.home .sec-title').forEach((t) => dio.observe(t));
  }

  /* ---------- the hero portrait drifts as you scroll ---------- */
  const photo = $('.hero-photo');
  if (photo && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        const y = Math.min(scrollY, innerHeight * 1.4);
        photo.style.translate = `0 ${(y * 0.08).toFixed(1)}px`;
        tick = false;
      });
    }, { passive: true });
  }
})();
