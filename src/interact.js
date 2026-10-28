/* Siddhi Kale: interactive sections.
   Experience roles that open, a services panel with tabs, a skill map, and a burst when a record comes into view. */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const sfx = () => (window.SKCinema && window.SKCinema.sfx) || null;
  const play = (n) => { const s = sfx(); if (s && s[n]) s[n](); };

  /* ---- experience: click a role to open it ---- */
  $$('.tl-item').forEach((item) => {
    const btn = $('.tl-head', item);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      play('pop');
    });
  });

  /* ---- services: tabs ---- */
  const panel = $('[data-svc]');
  if (panel) {
    const tabs = $$('.svc-tab', panel), views = $$('.svc-view', panel);
    const select = (i, focus) => {
      tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
      views.forEach((v, k) => {
        if (k === i) { v.hidden = false; v.classList.remove('is-in'); void v.offsetWidth; v.classList.add('is-in'); } else v.hidden = true;
      });
      if (focus) tabs[i].focus();
      play('tick');
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const n = tabs.length;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % n, true); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select((i + n - 1) % n, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(n - 1, true); }
      });
    });
  }

  /* ---- skill map: hover a skill, its projects light up ---- */
  const list = $('.pmap-list');
  if (list) {
    const pills = $$('li', list);
    const show = (slugs) => {
      const set = new Set(slugs);
      list.classList.toggle('has-focus', set.size > 0);
      pills.forEach((p) => p.classList.toggle('is-on', set.has(p.dataset.slug)));
    };
    const over = (e) => { const t = e.target.closest && e.target.closest('[data-slugs]'); if (t) show(t.dataset.slugs.split(',')); };
    // a finger lifts straight after the tap, so on touch the highlight is kept by focus and cleared by tapping elsewhere
    const out = (e) => { if (e.pointerType === 'touch') return; if (e.target.closest && e.target.closest('[data-slugs]')) show([]); };
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerout', out);
    document.addEventListener('focusin', over);
    document.addEventListener('focusout', out);
  }

  /* ---- records: a small burst when each one arrives ---- */
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const r = en.target.getBoundingClientRect();
        const w = document.createElement('span');
        w.className = 'fx-wave';
        w.style.left = (r.left + r.width / 2) + 'px';
        w.style.top = (r.top + Math.min(r.height * 0.35, 140)) + 'px';
        for (let i = 0; i < 12; i++) {
          const s = document.createElement('i');
          const a = (i / 12) * 6.283, d = 50 + Math.random() * 60;
          s.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
          s.style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
          w.appendChild(s);
        }
        document.body.appendChild(w);
        setTimeout(() => w.remove(), 900);
        play('chime');
      });
    }, { threshold: 0.6 });
    $$('.rec').forEach((r) => io.observe(r));
  }
})();

/* ---- "used in" hints: a single tooltip that is placed inside the screen and fades in smoothly ---- */
(() => {
  'use strict';
  const tip = document.createElement('div');
  tip.className = 'sk-tip';
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);
  let current = null;
  const place = (el) => {
    const r = el.getBoundingClientRect(), t = tip.getBoundingClientRect(), m = 8;
    let x = r.left + r.width / 2 - t.width / 2;
    x = Math.max(m, Math.min(x, innerWidth - t.width - m));
    let y = r.top - t.height - 10;
    if (y < m) y = r.bottom + 10;
    tip.style.left = Math.round(x) + 'px';
    tip.style.top = Math.round(y) + 'px';
  };
  const show = (e) => {
    const el = e.target.closest && e.target.closest('[data-used]');
    if (!el || el === current) return;
    current = el;
    tip.textContent = el.dataset.used;
    place(el);
    tip.classList.add('is-on');
  };
  const hide = (e) => {
    if (e.pointerType === 'touch') return;
    const el = e.target.closest && e.target.closest('[data-used]');
    if (!el || el !== current) return;
    current = null;
    tip.classList.remove('is-on');
  };
  document.addEventListener('pointerover', show);
  document.addEventListener('pointerout', hide);
  document.addEventListener('focusin', show);
  document.addEventListener('focusout', (e) => { if (e.target === current) { current = null; tip.classList.remove('is-on'); } });
  addEventListener('scroll', () => { if (current) place(current); }, { passive: true });
})();

/* ---- volunteering galleries: dots follow the swipe, and tapping a dot moves to that photo ---- */
(() => {
  'use strict';
  document.querySelectorAll('.frame-photo').forEach((box) => {
    const track = box.querySelector('.fp-track');
    const dots = Array.from(box.querySelectorAll('.fp-dot'));
    if (!track || !dots.length) return;
    dots.forEach((d, i) => d.addEventListener('click', () => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })));
    let t = 0;
    track.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const at = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        dots.forEach((d, i) => d.classList.toggle('is-on', i === at));
        sync(at);
      }, 60);
    }, { passive: true });
    const prev = box.querySelector('.fp-prev'), next = box.querySelector('.fp-next');
    const go = (n) => track.scrollTo({ left: Math.max(0, Math.min(dots.length - 1, n)) * track.clientWidth, behavior: 'smooth' });
    const here = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    function sync(at) { if (prev) prev.disabled = at <= 0; if (next) next.disabled = at >= dots.length - 1; }
    if (prev) prev.addEventListener('click', () => go(here() - 1));
    if (next) next.addEventListener('click', () => go(here() + 1));
    sync(0);
  });
})();
