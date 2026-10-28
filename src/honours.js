/* Siddhi Kale: the wins triptych.
   Three full-bleed panels in one frame. The active panel opens wide and the other two fold to slim strips.
   Hover, focus or tap a panel to open it. It also moves on by itself, slowly, and stops while you
   are looking at it, when you scroll away, or if you prefer reduced motion. */
(() => {
  'use strict';
  const root = document.querySelector('[data-honours]');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const panels = Array.from(root.querySelectorAll('.pan'));
  const n = panels.length;
  if (n < 2) return;
  let active = 0, held = false, visible = true;
  const sfx = () => (window.SKCinema && window.SKCinema.sfx) || null;

  function show(i, quiet) {
    if (i === active && !quiet) return;
    active = i;
    panels.forEach((p, k) => {
      if (k === i) { p.classList.remove('is-on'); void p.offsetWidth; p.classList.add('is-on'); } // restart the line, the draw and the sweep
      else p.classList.remove('is-on');
      p.setAttribute('aria-current', k === i ? 'true' : 'false');
    });
    if (!quiet) { const s = sfx(); if (s && s.tick) s.tick(); }
  }

  panels.forEach((p, i) => {
    p.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') show(i); });
    p.addEventListener('focus', () => show(i));
    // on touch, the first tap opens a folded panel; the next tap goes to its page
    p.addEventListener('click', (e) => { if (!p.classList.contains('is-on')) { e.preventDefault(); show(i); } });
    // the line along the bottom of the open panel is the countdown; when it fills, open the next one
    p.addEventListener('animationend', (e) => {
      if (e.animationName !== 'pan-fill' || reduce) return;
      if (!held && visible) show((i + 1) % n); else { p.classList.remove('is-on'); void p.offsetWidth; p.classList.add('is-on'); }
    });
  });

  // the open panel's picture leans slightly toward the pointer
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let raf = 0, px = 0, py = 0;
    root.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; root.style.setProperty('--px', px.toFixed(3)); root.style.setProperty('--py', py.toFixed(3)); });
    });
    root.addEventListener('pointerleave', () => { root.style.setProperty('--px', 0); root.style.setProperty('--py', 0); });
  }

  const hold = (v) => { held = v; root.classList.toggle('is-held', v); };
  root.addEventListener('pointerenter', () => hold(true));
  root.addEventListener('pointerleave', () => hold(false));
  root.addEventListener('focusin', () => hold(true));
  root.addEventListener('focusout', () => hold(false));
  if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; root.classList.toggle('is-away', !visible); }, { threshold: 0.25 }).observe(root);

  show(0, true);
  panels[0].classList.add('is-on');
  root.classList.add('is-ready');
})();
