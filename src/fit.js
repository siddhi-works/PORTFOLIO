/* Siddhi Kale: fit each section to the window.
   Sections are sized by the window (see the vh and vw sizes in the stylesheet). This script measures what is
   left over: if a section is still taller than the space under the top bar, it is scaled down smoothly until the
   heading and the content are on screen together. Any window size works, and it re-fits when the window changes.
   Phones use their own layout and are left alone. */
(() => {
  'use strict';
  if (!('CSS' in window) || !CSS.supports('zoom', '0.9')) return;
  const wide = window.matchMedia('(min-width: 761px)');
  const sections = Array.from(document.querySelectorAll('main.home > section.sec'));
  if (!sections.length) return;
  const FLOOR = 0.66;   // never smaller than two thirds, so text stays readable
  let timer = 0;

  function fit() {
    sections.forEach((s) => { s.style.zoom = ''; });
    if (!wide.matches) return;
    const bar = document.querySelector('.bar');
    const avail = innerHeight - (bar ? bar.getBoundingClientRect().bottom : 72) - 6;
    const natural = sections.map((s) => s.getBoundingClientRect().height);
    sections.forEach((s, i) => {
      const k = Math.min(1, Math.max(FLOOR, avail / natural[i]));
      if (k < 0.995) s.style.zoom = k.toFixed(3);
    });
    // sizes inside a section also follow the window height, so settle it in a few passes (down if too tall, up if too small)
    for (let pass = 0; pass < 4; pass++) {
      let moved = false;
      sections.forEach((s) => {
        const z = parseFloat(s.style.zoom) || 1;
        const h = s.getBoundingClientRect().height;
        if (Math.abs(h - avail) < avail * 0.012 && h <= avail * 1.01) return;
        const next = Math.min(1, Math.max(FLOOR, z * avail / h));
        if (Math.abs(next - z) > 0.004) { if (next >= 0.995) s.style.zoom = ''; else s.style.zoom = next.toFixed(3); moved = true; }
      });
      if (!moved) break;
    }
    // jumping to a section lands its heading just under the top bar, whatever the section's scale
    sections.forEach((s) => { const z = parseFloat(s.style.zoom) || 1; s.style.scrollMarginTop = Math.ceil((bar ? bar.getBoundingClientRect().bottom : 72) / z + 2) + 'px'; });
  }

  const refit = () => { clearTimeout(timer); timer = setTimeout(fit, 120); };
  addEventListener('resize', refit);
  addEventListener('orientationchange', refit);
  wide.addEventListener('change', fit);
  addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
})();
