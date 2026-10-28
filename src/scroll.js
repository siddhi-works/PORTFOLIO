/* Siddhi Kale: the thin progress line at the top of the page. */
(() => {
  'use strict';
  const d = document.documentElement;
  let ticking = false;
  const frame = () => {
    ticking = false;
    const max = Math.max(1, d.scrollHeight - innerHeight);
    d.style.setProperty('--sp', Math.min(1, Math.max(0, scrollY / max)).toFixed(4));
  };
  const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick);
  kick();
})();
