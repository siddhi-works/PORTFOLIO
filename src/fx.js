/* Siddhi Kale: motion and sound across the site.
   Section rules, the experience timeline, and quiet interface sounds.
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

})();
